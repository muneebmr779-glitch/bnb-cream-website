const express = require('express');
const { body } = require('express-validator');
const {
  createAppointment,
  getMyAppointments,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  rescheduleAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const bookingValidation = [
  body('vehicleMake').trim().notEmpty().withMessage('Vehicle make is required'),
  body('vehicleModel').trim().notEmpty().withMessage('Vehicle model is required'),
  body('vehicleYear')
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid vehicle year'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
  body('serviceId').isMongoId().withMessage('Please select a valid service'),
  body('date').notEmpty().withMessage('Preferred date is required'),
  body('time').trim().notEmpty().withMessage('Preferred time is required'),
];

router.use(protect);

router.post('/', bookingValidation, validate, createAppointment);
router.get('/my', getMyAppointments);
router.get('/', adminOnly, getAppointments);
router.get('/:id', getAppointmentById);
router.put(
  '/:id/status',
  adminOnly,
  [
    body('status')
      .isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'])
      .withMessage('Invalid status value'),
  ],
  validate,
  updateAppointmentStatus
);
router.put(
  '/:id/reschedule',
  [
    body('date').notEmpty().withMessage('Preferred date is required'),
    body('time').trim().notEmpty().withMessage('Preferred time is required'),
  ],
  validate,
  rescheduleAppointment
);
router.put('/:id/cancel', cancelAppointment);

module.exports = router;
