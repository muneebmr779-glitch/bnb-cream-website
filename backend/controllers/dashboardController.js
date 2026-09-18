const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');

// @desc    Get admin dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
const getStats = asyncHandler(async (req, res) => {
  const [
    totalCustomers,
    totalAppointments,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    cancelledAppointments,
    totalReviews,
    pendingReviews,
    revenueAgg,
    recentAppointments,
  ] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.countDocuments({ status: 'confirmed' }),
    Appointment.countDocuments({ status: 'completed' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Review.countDocuments(),
    Review.countDocuments({ approved: false }),
    Appointment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$priceQuoted' } } },
    ]),
    Appointment.find()
      .populate('customer', 'name')
      .populate('service', 'name')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  res.json({
    success: true,
    stats: {
      totalCustomers,
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      cancelledAppointments,
      totalReviews,
      pendingReviews,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
    recentAppointments,
  });
});

module.exports = { getStats };
