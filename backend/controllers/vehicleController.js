const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');

// @desc    Get logged-in customer's vehicles
// @route   GET /api/vehicles
// @access  Private
const getMyVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, vehicles });
});

// @desc    Add a vehicle
// @route   POST /api/vehicles
// @access  Private
const addVehicle = asyncHandler(async (req, res) => {
  const { make, model, year, registrationNumber } = req.body;

  const vehicle = await Vehicle.create({
    owner: req.user._id,
    make,
    model,
    year,
    registrationNumber,
  });

  res.status(201).json({ success: true, vehicle });
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are not authorized to update this vehicle');
  }

  const { make, model, year, registrationNumber } = req.body;
  if (make) vehicle.make = make;
  if (model) vehicle.model = model;
  if (year) vehicle.year = year;
  if (registrationNumber) vehicle.registrationNumber = registrationNumber;

  await vehicle.save();

  res.json({ success: true, vehicle });
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  if (vehicle.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are not authorized to delete this vehicle');
  }

  await vehicle.deleteOne();

  res.json({ success: true, message: 'Vehicle deleted successfully' });
});

module.exports = { getMyVehicles, addVehicle, updateVehicle, deleteVehicle };
