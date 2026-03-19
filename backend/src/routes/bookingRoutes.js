const express = require('express');
const { body } = require('express-validator');
const { createBooking, getMyBookings, cancelBooking, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/',
  authenticate,
  [
    body('serviceId').isNumeric().withMessage('Service ID must be a number'),
    body('scheduledAt').isISO8601().withMessage('Scheduled At must be a valid ISO 8601 date'),
    body('address').trim().notEmpty().withMessage('Address is required'),
  ],
  validateRequest,
  createBooking
);

router.get('/me', authenticate, getMyBookings);

router.put('/:id/cancel', authenticate, cancelBooking);

router.get('/', authenticate, authorize(['ADMIN']), getAllBookings);

router.put('/:id/status', authenticate, authorize(['ADMIN', 'PROVIDER']), updateBookingStatus);

module.exports = router;