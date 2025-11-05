import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import * as portfolioController from '../controllers/portfolioController';

const router = express.Router();

router.use(authenticate);

router.get('/', portfolioController.getPortfolio);

router.post(
  '/transaction',
  [
    body('stock_symbol').notEmpty().trim(),
    body('transaction_type').isIn(['BUY', 'SELL']),
    body('price').isFloat({ min: 0 }),
    body('quantity').isInt({ min: 1 }),
  ],
  portfolioController.addTransaction
);

router.get('/transactions', portfolioController.getTransactionHistory);

router.post(
  '/calculate-average',
  [
    body('old_avg_price').isFloat({ min: 0 }),
    body('old_quantity').isInt({ min: 0 }),
    body('new_price').isFloat({ min: 0 }),
    body('new_quantity').isInt({ min: 1 }),
  ],
  portfolioController.calculateAverage
);

export default router;
