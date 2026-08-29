const asyncHandler = require('express-async-handler');
const Appointment = require('../models/Appointment');
const Vehicle = require('../models/Vehicle');
const Service = require('../models/Service');
const sendEmail = require('../utils/sendEmail');
const {
  bookingConfirmationEmail,
  statusUpdateEmail,
} = require('../utils/emailTemplates');

const populateOptions = [
  { path: 'service', select: 'name price duration category image' },
  { path: 'vehicle', select: 'make model year registrationNumber' },
  { path: 'customer', select: 'name email phone' },
];

// @desc    Create a new appointment (booking)
// @route   POST /api/appointments
// @access  Private
const createAppointment = asyncHandler(async (req, res) => {
  const {
    vehicleMake,
    vehicleModel,
    vehicleYear,
    registrationNumber,
    serviceId,
    date,
    time,
    message,
    isEmergency,
  } = req.body;

  const service = await Service.findById(serviceId);
  if (!service || !service.isActive) {
    res.status(404);
    throw new Error('Selected service is not available');
  }

  const appointmentDate = new Date(date);
  if (Number.isNaN(appointmentDate.getTime()) || appointmentDate < new Date().setHours(0, 0, 0, 0)) {
    res.status(400);
    throw new Error('Please select a valid, future date');
  }

  // Reuse an existing vehicle with the same plate for this customer, otherwise create one
  let vehicle = await Vehicle.findOne({
    owner: req.user._id,
    registrationNumber: registrationNumber.toUpperCase(),
  });

  if (!vehicle) {
    vehicle = await Vehicle.create({
      owner: req.user._id,
      make: vehicleMake,
      model: vehicleModel,
      year: vehicleYear,
      registrationNumber,
    });
  }

  const appointment = await Appointment.create({
    customer: req.user._id,
    vehicle: vehicle._id,
    service: service._id,
    date: appointmentDate,
    time,
    message,
    isEmergency: !!isEmergency,
    priceQuoted: service.price,
  });

  await appointment.populate(populateOptions);

  await sendEmail({
    to: req.user.email,
    subject: `Appointment Confirmation - ${appointment.bookingId}`,
    html: bookingConfirmationEmail({
      customerName: req.user.name,
      bookingId: appointment.bookingId,
      serviceName: service.name,
      vehicle: `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})`,
      date: appointmentDate.toDateString(),
      time,
      status: appointment.status,
    }),
  });

  res.status(201).json({ success: true, appointment });
});

// @desc    Get logged-in customer's appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = { customer: req.user._id };
  if (status && status !== 'all') {
    query.status = status;
  }

  const appointments = await Appointment.find(query)
    .populate(populateOptions)
    .sort({ date: -1, createdAt: -1 });

  res.json({ success: true, count: appointments.length, appointments });
});

// @desc    Get all appointments (admin)
// @route   GET /api/appointments
// @access  Private/Admin
const getAppointments = asyncHandler(async (req, res) => {
  const { status, search, date, page = 1, limit = 10 } = req.query;
  const query = {};

  if (status && status !== 'all') {
    query.status = status;
  }

  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query.date = { $gte: start, $lte: end };
  }

  if (search) {
    query.bookingId = { $regex: search, $options: 'i' };
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);

  const [appointments, total] = await Promise.all([
    Appointment.find(query)
      .populate(populateOptions)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Appointment.countDocuments(query),
  ]);

  res.json({
    success: true,
    count: appointments.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    appointments,
  });
});

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(populateOptions);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const isOwner = appointment.customer._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are not authorized to view this appointment');
  }

  res.json({ success: true, appointment });
});

// @desc    Update appointment status (admin)
// @route   PUT /api/appointments/:id/status
// @access  Private/Admin
const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { status, priceQuoted } = req.body;

  const appointment = await Appointment.findById(req.params.id).populate(populateOptions);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  appointment.status = status;
  if (priceQuoted !== undefined) appointment.priceQuoted = priceQuoted;
  if (status === 'cancelled') appointment.cancelledBy = 'admin';

  await appointment.save();

  await sendEmail({
    to: appointment.customer.email,
    subject: `Appointment ${status.replace('-', ' ')} - ${appointment.bookingId}`,
    html: statusUpdateEmail({
      customerName: appointment.customer.name,
      bookingId: appointment.bookingId,
      serviceName: appointment.service.name,
      status: appointment.status,
    }),
  });

  res.json({ success: true, appointment });
});

// @desc    Reschedule an appointment
// @route   PUT /api/appointments/:id/reschedule
// @access  Private
const rescheduleAppointment = asyncHandler(async (req, res) => {
  const { date, time } = req.body;

  const appointment = await Appointment.findById(req.params.id).populate(populateOptions);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const isOwner = appointment.customer._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are not authorized to modify this appointment');
  }

  if (['completed', 'cancelled'].includes(appointment.status)) {
    res.status(400);
    throw new Error(`Cannot reschedule an appointment that is already ${appointment.status}`);
  }

  const newDate = new Date(date);
  if (Number.isNaN(newDate.getTime()) || newDate < new Date().setHours(0, 0, 0, 0)) {
    res.status(400);
    throw new Error('Please select a valid, future date');
  }

  appointment.date = newDate;
  appointment.time = time;
  appointment.status = 'pending';
  await appointment.save();

  res.json({ success: true, appointment });
});

// @desc    Cancel an appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findById(req.params.id).populate(populateOptions);
  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const isOwner = appointment.customer._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You are not authorized to cancel this appointment');
  }

  if (['completed', 'cancelled'].includes(appointment.status)) {
    res.status(400);
    throw new Error(`This appointment is already ${appointment.status}`);
  }

  appointment.status = 'cancelled';
  appointment.cancelledBy = req.user.role === 'admin' ? 'admin' : 'customer';
  await appointment.save();

  await sendEmail({
    to: appointment.customer.email,
    subject: `Appointment Cancelled - ${appointment.bookingId}`,
    html: statusUpdateEmail({
      customerName: appointment.customer.name,
      bookingId: appointment.bookingId,
      serviceName: appointment.service.name,
      status: 'cancelled',
    }),
  });

  res.json({ success: true, appointment });
});

module.exports = {
  createAppointment,
  getMyAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
};
