const crypto = require('crypto');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/competitions/:id/register
//
// Concurrency strategy:
// Two users hitting "Register" for the last spot at the same instant is
// the core race condition this feature must handle correctly. Rather than
// "read spotsLeft, then write" (which is not safe under concurrency), we
// perform a single atomic findOneAndUpdate whose filter re-checks
// capacity and the registration window at the DB level. MongoDB
// guarantees only one of the two concurrent requests can match+increment
// for the final spot; the loser's filter no longer matches and it gets
// null back, which we turn into a clean 409.
const registerForCompetition = asyncHandler(async (req, res) => {
  const now = new Date();
  const competitionId = req.params.id;
  const userId = req.user.id;

  // Fast pre-check for a friendlier error message (not relied on for safety).
  const existing = await Registration.findOne({
    competition: competitionId,
    user: userId,
    status: { $ne: 'cancelled' },
  });
  if (existing) throw new ApiError(409, 'You are already registered for this competition.', 'ALREADY_REGISTERED');

  const updated = await Competition.findOneAndUpdate(
    {
      _id: competitionId,
      isActive: true,
      'dates.registrationOpensAt': { $lte: now },
      'dates.registrationClosesAt': { $gt: now },
      $expr: { $lt: ['$spotsBooked', '$maxSpots'] },
    },
    { $inc: { spotsBooked: 1 } },
    { new: true }
  );

  if (!updated) {
    // Figure out *why* it failed so the client can show the right message.
    const competition = await Competition.findById(competitionId);
    if (!competition || !competition.isActive) throw new ApiError(404, 'Competition not found', 'NOT_FOUND');

    const state = competition.getDerivedState(now);
    if (state.registrationState === 'full') {
      throw new ApiError(409, 'All spots are booked for this competition.', 'COMPETITION_FULL');
    }
    if (state.registrationState === 'not_started') {
      throw new ApiError(400, 'Registration has not opened yet.', 'REGISTRATION_NOT_STARTED');
    }
    throw new ApiError(400, 'Registration is closed for this competition.', 'REGISTRATION_CLOSED');
  }

  try {
    const registration = await Registration.create({
      competition: competitionId,
      user: userId,
      entryFeePaid: updated.entryFee,
      status: updated.entryFee > 0 ? 'pending' : 'confirmed', // free comps skip payment
      payment:
        updated.entryFee > 0
          ? { provider: updated.paymentProvider, orderId: crypto.randomUUID(), status: 'pending' }
          : { status: 'paid' },
    });

    return res.status(201).json({
      registration: {
        id: registration._id,
        status: registration.status,
        entryFeePaid: registration.entryFeePaid,
        payment: registration.payment,
      },
      spotsLeft: Math.max(updated.maxSpots - updated.spotsBooked, 0),
    });
  } catch (err) {
    // The spot was reserved, but we failed to persist the registration
    // (e.g. a duplicate-key race from a double-click that both passed the
    // pre-check). Compensate by releasing the spot we just took.
    await Competition.updateOne({ _id: competitionId }, { $inc: { spotsBooked: -1 } });
    throw err;
  }
});

// POST /api/competitions/:id/registration/confirm-payment
// Mock payment confirmation — see README "Assumptions" re: Razorpay.
const confirmPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.body;
  const registration = await Registration.findOne({
    competition: req.params.id,
    user: req.user.id,
    status: { $ne: 'cancelled' },
  });
  if (!registration) throw new ApiError(404, 'Registration not found', 'NOT_FOUND');
  if (!paymentId) throw new ApiError(400, 'paymentId is required', 'VALIDATION_ERROR');

  registration.status = 'confirmed';
  registration.payment.status = 'paid';
  registration.payment.paymentId = paymentId;
  await registration.save();

  res.json({ registration: { id: registration._id, status: registration.status } });
});

// DELETE /api/competitions/:id/register
// Cancelling frees the spot atomically and only while registration is
// still open (once it closes, cancellations are out of scope for this
// assignment and would go through a support/refund flow instead).
const cancelRegistration = asyncHandler(async (req, res) => {
  const now = new Date();
  const registration = await Registration.findOne({
    competition: req.params.id,
    user: req.user.id,
    status: { $ne: 'cancelled' },
  });
  if (!registration) throw new ApiError(404, 'Registration not found', 'NOT_FOUND');

  const competition = await Competition.findById(req.params.id);
  if (competition && now >= competition.dates.registrationClosesAt) {
    throw new ApiError(400, 'Registration window has closed; contact support to cancel.', 'WINDOW_CLOSED');
  }

  registration.status = 'cancelled';
  await registration.save();
  await Competition.updateOne({ _id: req.params.id }, { $inc: { spotsBooked: -1 } });

  res.json({ success: true });
});

module.exports = { registerForCompetition, confirmPayment, cancelRegistration };
