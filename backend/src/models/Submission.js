const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema(
  {
    competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    registration: { type: mongoose.Schema.Types.ObjectId, ref: 'Registration', required: true },

    mediaUrl: { type: String, required: true },
    caption: { type: String, default: '' },

    // A user may re-upload while the submission window is open; we keep
    // history instead of overwriting so judges can see revisions.
    version: { type: Number, default: 1 },
    status: { type: String, enum: ['submitted', 'withdrawn'], default: 'submitted' },
  },
  { timestamps: true }
);

submissionSchema.index({ competition: 1, user: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
