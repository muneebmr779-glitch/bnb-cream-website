const express = require('express');
const { body } = require('express-validator');
const {
  getMyVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} = require('../controllers/vehicleController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

const vehicleValidation = [
  body('make').trim().notEmpty().withMessage('Vehicle make is required'),
  body('model').trim().notEmpty().withMessage('Vehicle model is required'),
  body('year')
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
    .withMessage('Please provide a valid vehicle year'),
  body('registrationNumber').trim().notEmpty().withMessage('Registration number is required'),
];

router.use(protect);

router.get('/', getMyVehicles);
router.post('/', vehicleValidation, validate, addVehicle);
router.put('/:id', updateVehicle);
router.delete('/:id', deleteVehicle);

module.exports = router;
