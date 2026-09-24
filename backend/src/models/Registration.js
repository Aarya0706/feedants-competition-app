const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    competition: { type: mongoose.Schema.Types.ObjectId, ref: 'Competition', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // 'pending' until payment confirms, then 'confirmed'. 'cancelled' frees the spot.
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },

    entryFeePaid: { type: Number, required: true },
    payment: {
      provider: { type: String, default: 'razorpay' },
      orderId: { type: String },
      paymentId: { type: String },
      status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    },

    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can hold at most one active registration per competition.
// This is the safety net that makes double-registration impossible even
// if two requests race past the application-level check.
registrationSchema.index({ competition: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
