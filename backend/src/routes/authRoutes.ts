import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout } from '../controllers/authController';
import { validateRequest } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('phone')
      .matches(/^\+212[5-7]\d{8}$/).withMessage('Invalid Moroccan phone number format (+212 followed by 9 digits)'),
    body('acceptTerms').equals('true').withMessage('You must accept the terms and conditions'),
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

router.post('/logout', authenticate, logout);

export default router;