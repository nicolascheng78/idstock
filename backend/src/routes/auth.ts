import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController';
import { authLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.post(
  '/signup',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('full_name').notEmpty().trim(),
  ],
  authController.signup
);

router.post(
  '/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

router.post('/verify-email', authController.verifyEmail);
router.post('/request-password-reset', authLimiter, authController.requestPasswordReset);
router.post('/reset-password', authLimiter, authController.resetPassword);

export default router;
