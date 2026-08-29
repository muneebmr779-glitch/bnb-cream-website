const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    time: {
      type: String,
      required: [true, 'Preferred time is required'],
    },
    message: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    priceQuoted: {
      type: Number,
      default: 0,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    cancelledBy: {
      type: String,
      enum: ['customer', 'admin', null],
      default: null,
    },
  },
  { timestamps: true }
);

appointmentSchema.pre('validate', function generateBookingId(next) {
  if (!this.bookingId) {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.bookingId = `ACP-${Date.now().toString().slice(-6)}${random}`;
  }
  next();
});

appointmentSchema.index({ customer: 1, status: 1 });
appointmentSchema.index({ date: 1, status: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
