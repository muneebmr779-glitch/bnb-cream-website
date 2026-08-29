const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Update own profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    Get all customers (admin)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  const query = { role: 'customer' };
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [users, total] = await Promise.all([
    User.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: users.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    users: users.map((u) => u.toSafeObject()),
  });
});

// @desc    Get single customer with appointment history (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const appointments = await Appointment.find({ customer: user._id })
    .populate('service', 'name price')
    .populate('vehicle', 'make model year registrationNumber')
    .sort({ createdAt: -1 });

  res.json({ success: true, user: user.toSafeObject(), appointments });
});

// @desc    Update a customer (admin)
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Customer not found');
  }

  const { name, phone, isActive } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (isActive !== undefined) user.isActive = isActive;

  await user.save();

  res.json({ success: true, user: user.toSafeObject() });
});

// @desc    Delete a customer (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Customer not found');
  }

  if (user.role === 'admin') {
    res.status(400);
    throw new Error('Administrator accounts cannot be deleted from this endpoint');
  }

  await user.deleteOne();

  res.json({ success: true, message: 'Customer deleted successfully' });
});

module.exports = {
  updateProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
