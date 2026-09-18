const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');

// @desc    Get approved reviews (public) or all reviews (admin)
// @route   GET /api/reviews
// @access  Public / Private/Admin (via ?all=true)
const getReviews = asyncHandler(async (req, res) => {
  const { all } = req.query;
  const query = {};

  if (!(all === 'true' && req.user && req.user.role === 'admin')) {
    query.approved = true;
  }

  const reviews = await Review.find(query)
    .populate('customer', 'name avatar')
    .populate('service', 'name')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: reviews.length, reviews });
});

// @desc    Submit a review for a completed appointment
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { appointmentId, rating, comment } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  if (appointment.customer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only review your own appointments');
  }

  if (appointment.status !== 'completed') {
    res.status(400);
    throw new Error('You can only review completed services');
  }

  const existing = await Review.findOne({ appointment: appointmentId });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this appointment');
  }

  const review = await Review.create({
    customer: req.user._id,
    service: appointment.service,
    appointment: appointmentId,
    rating,
    comment,
  });

  await review.populate('customer', 'name avatar');
  await review.populate('service', 'name');

  res.status(201).json({ success: true, review });
});

// @desc    Approve/reject a review (admin)
// @route   PUT /api/reviews/:id
// @access  Private/Admin
const updateReviewStatus = asyncHandler(async (req, res) => {
  const { approved } = req.body;

  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  review.approved = approved;
  await review.save();

  res.json({ success: true, review });
});

// @desc    Delete a review (admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  await review.deleteOne();

  res.json({ success: true, message: 'Review deleted successfully' });
});

module.exports = { getReviews, createReview, updateReviewStatus, deleteReview };
