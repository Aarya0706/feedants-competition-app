const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// POST /api/competitions/:id/submissions
// Validations enforced server-side (never trust the client's view of state):
//   1. Competition exists and is active.
//   2. Caller has a *confirmed* registration for it.
//   3. Submission window is currently open.
const createSubmission = asyncHandler(async (req, res) => {
  const now = new Date();
  const { mediaUrl, caption } = req.body;
  if (!mediaUrl) throw new ApiError(400, 'mediaUrl is required', 'VALIDATION_ERROR');

  const competition = await Competition.findById(req.params.id);
  if (!competition || !competition.isActive) throw new ApiError(404, 'Competition not found', 'NOT_FOUND');

  const registration = await Registration.findOne({
    competition: competition._id,
    user: req.user.id,
    status: 'confirmed',
  });
  if (!registration) {
    throw new ApiError(403, 'You must have a confirmed registration to submit an entry.', 'NOT_REGISTERED');
  }

  const state = competition.getDerivedState(now);
  if (!state.submissionOpen) {
    const message =
      state.submissionState === 'not_started'
        ? `Submissions open on ${competition.dates.submissionStartsAt.toISOString()}.`
        : 'The submission window has closed.';
    throw new ApiError(400, message, 'SUBMISSION_WINDOW_CLOSED');
  }

  const lastVersion = await Submission.findOne({ competition: competition._id, user: req.user.id })
    .sort({ version: -1 })
    .lean();

  const submission = await Submission.create({
    competition: competition._id,
    user: req.user.id,
    registration: registration._id,
    mediaUrl,
    caption,
    version: lastVersion ? lastVersion.version + 1 : 1,
  });

  res.status(201).json({ submission: { id: submission._id, version: submission.version, mediaUrl: submission.mediaUrl } });
});

module.exports = { createSubmission };
