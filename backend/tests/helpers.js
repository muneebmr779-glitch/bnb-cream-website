const User = require('../models/User');
const Service = require('../models/Service');
const generateToken = require('../utils/generateToken');

const createUser = async (overrides = {}) => {
  const user = await User.create({
    name: 'Test Customer',
    email: `customer${Date.now()}${Math.random()}@example.com`,
    phone: '+1-555-0101',
    password: 'Password123!',
    role: 'customer',
    ...overrides,
  });
  const token = generateToken(user._id, user.role);
  return { user, token };
};

const createAdmin = async (overrides = {}) =>
  createUser({
    name: 'Test Admin',
    email: `admin${Date.now()}${Math.random()}@example.com`,
    role: 'admin',
    ...overrides,
  });

const createService = async (overrides = {}) =>
  Service.create({
    name: 'Oil Change',
    description: 'Standard oil change service',
    price: 49,
    duration: '30 min',
    category: 'maintenance',
    ...overrides,
  });

module.exports = { createUser, createAdmin, createService };
