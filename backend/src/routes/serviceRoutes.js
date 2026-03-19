const express = require('express');
const { body, query } = require('express-validator');
const { getServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.get(
  '/',
  [
    query('search').optional().isString(),
    query('category').optional().isString(),
    query('minPrice').optional().isNumeric(),
    query('maxPrice').optional().isNumeric(),
    query('rating').optional().isNumeric(),
  ],
  validateRequest,
  getServices
);

router.get('/:id', getServiceById);

router.post(
  '/',
  authenticate,
  authorize(['ADMIN']),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('basePrice').isNumeric().withMessage('Base price must be a number'),
    body('duration').isNumeric().withMessage('Duration must be a number'),
    body('available').optional().isBoolean(),
  ],
  validateRequest,
  createService
);

router.put(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('basePrice').optional().isNumeric(),
    body('duration').optional().isNumeric(),
    body('available').optional().isBoolean(),
  ],
  validateRequest,
  updateService
);

router.delete(
  '/:id',
  authenticate,
  authorize(['ADMIN']),
  deleteService
);

module.exports = router;