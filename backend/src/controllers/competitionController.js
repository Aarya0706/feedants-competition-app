const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

const listCompetitions = asyncHandler(async (req, res) => {
  const now = new Date();
  const competitions = await Competition.find({ isActive: true }).sort({ 'dates.registrationClosesAt': 1 }).lean();

  // .lean() gives plain objects, so recompute derived state via a throwaway
  // hydrated document for each — cheap for a list endpoint's summary fields.
  const summaries = competitions.map((c) => {
    const doc = new Competition(c);
    const state = doc.getDerivedState(now);
    return {
      id: c._id,
      title: c.title,
      tags: c.tags,
      entryFee: c.entryFee,
      prizePoolTotal: c.prizePoolTotal,
      spotsLeft: state.spotsLeft,
      registrationState: state.registrationState,
      registrationClosesAt: c.dates.registrationClosesAt,
    };
  });

  res.json({ competitions: summaries });
});

// GET /api/competitions/:id
// Returns everything the Competition Details screen needs in one call:
// static content + live/derived state + (if authenticated) the viewer's
// personal participation state. Nothing about registration/submission
// state is hardcoded on the client — it's all computed here, server-side,
// against the current time on every request.
const getCompetitionDetails = asyncHandler(async (req, res) => {
  const competition = await Competition.findById(req.params.id);
  if (!competition || !competition.isActive) {
    throw new ApiError(404, 'Competition not found', 'NOT_FOUND');
  }

  const now = new Date();
  const state = competition.getDerivedState(now);

  let viewer = { isRegistered: false, registrationStatus: null, hasSubmitted: false, latestSubmissionAt: null };

  if (req.user) {
    const registration = await Registration.findOne({
      competition: competition._id,
      user: req.user.id,
      status: { $ne: 'cancelled' },
    }).lean();

    if (registration) {
      const submission = await Submission.findOne({
        competition: competition._id,
        user: req.user.id,
        status: 'submitted',
      })
        .sort({ version: -1 })
        .lean();

      viewer = {
        isRegistered: true,
        registrationStatus: registration.status, // pending | confirmed
        hasSubmitted: Boolean(submission),
        latestSubmissionAt: submission ? submission.updatedAt : null,
      };
    }
  }

  res.json({
    competition: {
      id: competition._id,
      title: competition.title,
      tags: competition.tags,
      highlightNote: competition.highlightNote,
      currency: competition.currency,
      prizePoolTotal: competition.prizePoolTotal,
      entryFee: competition.entryFee,
      maxSpots: competition.maxSpots,
      spotsBooked: competition.spotsBooked,
      judge: competition.judge,
      dates: competition.dates,
      about: competition.about,
      judgingParameters: competition.judgingParameters,
      rulesAndEligibility: competition.rulesAndEligibility,
      rewards: competition.rewards,
      previousWinners: competition.previousWinners,
      disclaimer: competition.disclaimer,
      refundPolicyUrl: competition.refundPolicyUrl,
      paymentProvider: competition.paymentProvider,
      referral: competition.referral,
    },
    state, // spotsLeft, registrationState, submissionState, resultsDeclared...
    viewer, // isRegistered, registrationStatus, hasSubmitted...
    serverTime: now, // lets the client compute an accurate local countdown
  });
});

module.exports = { listCompetitions, getCompetitionDetails };
