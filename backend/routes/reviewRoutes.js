const express = require('express');
const { body } = require('express-validator');
const {
  getReviews,
  createReview,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Attach user if a token is present, without requiring auth (for the ?all=true admin view check)
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return protect(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, getReviews);

router.post(
  '/',
  protect,
  [
    body('appointmentId').isMongoId().withMessage('A valid appointment is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Review comment is required'),
  ],
  validate,
  createReview
);

router.put('/:id', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
