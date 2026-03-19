const express = require('express');
const { body } = require('express-validator');
const { register, login, getMe, updatePushToken, logout } = require('../controllers/authController');
const { validateRequest } = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('phone').optional().isString(),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.get('/me', authenticate, getMe);

router.put('/push-token', authenticate, updatePushToken);

router.post('/logout', authenticate, logout);

module.exports = router;