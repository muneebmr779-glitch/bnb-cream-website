const asyncHandler = require('express-async-handler');
const Service = require('../models/Service');
const Appointment = require('../models/Appointment');

const buildServiceQuery = ({ search, category, popular }) => {
  const query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (popular === 'true') {
    query.isPopular = true;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

// @desc    Get all active services (with search/filter)
// @route   GET /api/services
// @access  Public
const getServices = asyncHandler(async (req, res) => {
  const query = { ...buildServiceQuery(req.query), isActive: true };

  const services = await Service.find(query).sort({ createdAt: -1 });

  res.json({ success: true, count: services.length, services });
});

// @desc    Get all services including inactive ones (for management)
// @route   GET /api/services/admin/all
// @access  Private/Admin
const getAllServicesAdmin = asyncHandler(async (req, res) => {
  const query = buildServiceQuery(req.query);

  const services = await Service.find(query).sort({ createdAt: -1 });

  res.json({ success: true, count: services.length, services });
});

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  res.json({ success: true, service });
});

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = asyncHandler(async (req, res) => {
  const { name, description, price, duration, category, isPopular, icon } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : req.body.image || '';

  const service = await Service.create({
    name,
    description,
    price,
    duration,
    category,
    icon,
    isPopular: isPopular === 'true' || isPopular === true,
    image,
  });

  res.status(201).json({ success: true, service });
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const fields = ['name', 'description', 'price', 'duration', 'category', 'icon', 'isActive', 'isPopular'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      service[field] = req.body[field];
    }
  });

  if (req.file) {
    service.image = `/uploads/${req.file.filename}`;
  } else if (req.body.image !== undefined) {
    service.image = req.body.image;
  }

  await service.save();

  res.json({ success: true, service });
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    res.status(404);
    throw new Error('Service not found');
  }

  const activeBookings = await Appointment.countDocuments({
    service: service._id,
    status: { $in: ['pending', 'confirmed', 'in-progress'] },
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error(
      'This service has active appointments and cannot be deleted. Deactivate it instead.'
    );
  }

  await service.deleteOne();

  res.json({ success: true, message: 'Service deleted successfully' });
});

module.exports = {
  getServices,
  getAllServicesAdmin,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
