const asyncHandler = require('express-async-handler');
const ContactMessage = require('../models/ContactMessage');
const sendEmail = require('../utils/sendEmail');
const { contactReceivedEmail } = require('../utils/emailTemplates');

// @desc    Submit a contact / emergency message
// @route   POST /api/contact
// @access  Public
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, isEmergency } = req.body;

  const contactMessage = await ContactMessage.create({
    name,
    email,
    phone,
    subject,
    message,
    isEmergency: !!isEmergency,
  });

  await sendEmail({
    to: email,
    subject: 'We received your message - AutoCare Pro',
    html: contactReceivedEmail(name),
  });

  res.status(201).json({ success: true, contactMessage });
});

// @desc    Get all contact messages (admin)
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = asyncHandler(async (req, res) => {
  const { isRead } = req.query;
  const query = {};
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const messages = await ContactMessage.find(query).sort({ createdAt: -1 });

  res.json({ success: true, count: messages.length, messages });
});

// @desc    Mark a contact message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markMessageRead = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  message.isRead = true;
  await message.save();

  res.json({ success: true, message });
});

// @desc    Delete a contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Message not found');
  }

  await message.deleteOne();

  res.json({ success: true, message: 'Message deleted successfully' });
});

module.exports = {
  createContactMessage,
  getContactMessages,
  markMessageRead,
  deleteContactMessage,
};
