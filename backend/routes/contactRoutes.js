const express = require('express');
const { body } = require('express-validator');
const {
  createContactMessage,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  createContactMessage
);

router.get('/', protect, adminOnly, getContactMessages);
router.put('/:id/read', protect, adminOnly, markMessageRead);
router.delete('/:id', protect, adminOnly, deleteContactMessage);

module.exports = router;
