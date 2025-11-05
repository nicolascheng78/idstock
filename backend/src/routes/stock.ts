import express from 'express';
import * as stockController from '../controllers/stockController';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

router.use(apiLimiter);

router.get('/indices', stockController.getIndices);
router.get('/search', stockController.search);
router.get('/multiple', stockController.getStocks);
router.get('/:symbol', stockController.getStock);

export default router;
