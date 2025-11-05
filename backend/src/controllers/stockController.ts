import { Request, Response } from 'express';
import { getStockData, getMultipleStocks, getMarketIndices, searchStocks } from '../services/stockService';

export const getStock = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const stockData = await getStockData(symbol);
    res.json(stockData);
  } catch (error) {
    console.error('Get stock error:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
};

export const getStocks = async (req: Request, res: Response) => {
  try {
    const symbols = req.query.symbols as string;
    if (!symbols) {
      return res.status(400).json({ error: 'Symbols parameter required' });
    }
    
    const symbolArray = symbols.split(',').map(s => s.trim());
    const stocksData = await getMultipleStocks(symbolArray);
    res.json(stocksData);
  } catch (error) {
    console.error('Get stocks error:', error);
    res.status(500).json({ error: 'Failed to fetch stocks data' });
  }
};

export const getIndices = async (req: Request, res: Response) => {
  try {
    const indices = await getMarketIndices();
    res.json(indices);
  } catch (error) {
    console.error('Get indices error:', error);
    res.status(500).json({ error: 'Failed to fetch market indices' });
  }
};

export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const results = await searchStocks(q);
    res.json(results);
  } catch (error) {
    console.error('Search stocks error:', error);
    res.status(500).json({ error: 'Failed to search stocks' });
  }
};
