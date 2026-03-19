const express = require('express');
const { body } = require('express-validator');
const { createPaymentIntent, handleWebhook } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const { validateRequest } = require('../middleware/validate');

const router = express.Router();

router.post(
  '/create-intent',
  authenticate,
  [
    body('bookingId').isNumeric().withMessage('Booking ID must be a number'),
  ],
  validateRequest,
  createPaymentIntent
);

// Note: Stripe Webhook expects the raw body for signature verification.
// We'll configure Express to parse JSON and raw requests accordingly in the index file.
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;