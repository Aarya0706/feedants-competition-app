const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    position: { type: Number, required: true }, // 1, 2, 3...
    label: { type: String, required: true }, // "1st Winner"
    amount: { type: Number, required: true },
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: Number, required: true },
    label: { type: String, required: true }, // "1st Winner"
    thumbnailUrl: { type: String },
    videoUrl: { type: String },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] }, // ["Dance", "Multi-Win"]
    highlightNote: { type: String, default: '' }, // "Winners get certificate"

    currency: { type: String, default: 'INR' },
    prizePoolTotal: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },

    // Capacity. spotsBooked is mutated ONLY through atomic findOneAndUpdate
    // operations (see registrationController) so it stays correct under
    // concurrent registrations.
    maxSpots: { type: Number, required: true, min: 1 },
    spotsBooked: { type: Number, default: 0, min: 0 },

    judge: {
      name: { type: String, required: true },
      title: { type: String, default: 'Judge' },
      subtitle: { type: String, default: '' }, // "Professional Kathak Dancer"
      experienceLabel: { type: String, default: '' }, // "12+ Years of Experience"
      photoUrl: { type: String, default: '' },
      introVideoUrl: { type: String, default: '' },
    },

    dates: {
      registrationOpensAt: { type: Date, required: true },
      registrationClosesAt: { type: Date, required: true },
      submissionStartsAt: { type: Date, required: true },
      submissionEndsAt: { type: Date, required: true },
      resultDate: { type: Date, required: true },
    },

    about: { type: String, default: '' },
    judgingParameters: { type: String, default: '' },
    rulesAndEligibility: { type: String, default: '' },

    rewards: { type: [rewardSchema], default: [] },
    previousWinners: { type: [winnerSchema], default: [] },

    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.',
    },
    refundPolicyUrl: { type: String, default: '' },
    paymentProvider: { type: String, default: 'razorpay' },

    referral: {
      enabled: { type: Boolean, default: true },
      earnAmountPerSignup: { type: Number, default: 0 },
    },

    resultsPublished: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }, // admin kill-switch, independent of dates
  },
  { timestamps: true }
);

competitionSchema.index({ 'dates.registrationClosesAt': 1 });
competitionSchema.index({ isActive: 1 });

/**
 * Pure function (no DB access) that derives every time/state-dependent
 * flag the client needs, given a competition document and "now".
 * Keeping this pure makes it easy to unit test and reuse from both the
 * details endpoint and the registration/submission validators.
 */
competitionSchema.methods.getDerivedState = function getDerivedState(now = new Date()) {
  const d = this.dates;
  const spotsLeft = Math.max(this.maxSpots - this.spotsBooked, 0);
  const isFull = spotsLeft <= 0;

  const registrationWindowOpen = now >= d.registrationOpensAt && now < d.registrationClosesAt;
  const registrationOpen = this.isActive && registrationWindowOpen && !isFull;

  let registrationState;
  if (!this.isActive) registrationState = 'inactive';
  else if (now < d.registrationOpensAt) registrationState = 'not_started';
  else if (isFull) registrationState = 'full';
  else if (now >= d.registrationClosesAt) registrationState = 'closed';
  else registrationState = 'open';

  const submissionOpen = this.isActive && now >= d.submissionStartsAt && now < d.submissionEndsAt;
  let submissionState;
  if (now < d.submissionStartsAt) submissionState = 'not_started';
  else if (now >= d.submissionEndsAt) submissionState = 'closed';
  else submissionState = 'open';

  const resultsDeclared = this.resultsPublished && now >= d.resultDate;

  return {
    spotsLeft,
    isFull,
    registrationOpen,
    registrationState, // not_started | open | full | closed | inactive
    submissionOpen,
    submissionState, // not_started | open | closed
    resultsDeclared,
  };
};

module.exports = mongoose.model('Competition', competitionSchema);
