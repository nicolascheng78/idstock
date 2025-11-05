import express from 'express';
import * as stockController from '../controllers/stockController';

const router = express.Router();

router.get('/indices', stockController.getIndices);
router.get('/search', stockController.search);
router.get('/multiple', stockController.getStocks);
router.get('/:symbol', stockController.getStock);

export default router;
