import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { authenticatedLimiter } from '../middleware/rateLimiter';
import * as watchlistController from '../controllers/watchlistController';

const router = express.Router();

router.use(authenticate);
router.use(authenticatedLimiter);

router.get('/', watchlistController.getWatchlist);

router.post(
  '/',
  [body('stock_symbol').notEmpty().trim()],
  watchlistController.addToWatchlist
);

router.delete('/:symbol', watchlistController.removeFromWatchlist);

export default router;
