const express = require('express');
const { body } = require('express-validator');
const {
  getServices,
  getAllServicesAdmin,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const upload = require('../middleware/upload');

const router = express.Router();

const serviceValidation = [
  body('name').trim().notEmpty().withMessage('Service name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').trim().notEmpty().withMessage('Estimated duration is required'),
];

router.get('/', getServices);
router.get('/admin/all', protect, adminOnly, getAllServicesAdmin);
router.get('/:id', getServiceById);

router.post(
  '/',
  protect,
  adminOnly,
  upload.single('image'),
  serviceValidation,
  validate,
  createService
);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
