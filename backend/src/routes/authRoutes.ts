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

router.post('/logout', authenticate, logout);

export default router;