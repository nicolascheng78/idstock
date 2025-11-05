import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Watchlist } from '../models';
import { getMultipleStocks } from '../services/stockService';

export const getWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const watchlist = await Watchlist.findAll({ where: { user_id: userId } });

    // Get current prices for watchlist stocks
    const symbols = watchlist.map(w => w.stock_symbol);
    const stockData = symbols.length > 0 ? await getMultipleStocks(symbols) : [];

    const enrichedWatchlist = watchlist.map(item => {
      const stock = stockData.find(s => s.symbol === item.stock_symbol);
      return {
        ...item.toJSON(),
        stock_data: stock,
      };
    });

    res.json({ watchlist: enrichedWatchlist });
  } catch (error) {
    console.error('Get watchlist error:', error);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

export const addToWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { stock_symbol } = req.body;

    // Check if already in watchlist
    const existing = await Watchlist.findOne({
      where: { user_id: userId, stock_symbol },
    });

    if (existing) {
      return res.status(400).json({ error: 'Stock already in watchlist' });
    }

    const watchlistItem = await Watchlist.create({
      user_id: userId,
      stock_symbol,
    });

    res.status(201).json({
      message: 'Stock added to watchlist',
      watchlist: watchlistItem,
    });
  } catch (error) {
    console.error('Add to watchlist error:', error);
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};

export const removeFromWatchlist = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { symbol } = req.params;

    const deleted = await Watchlist.destroy({
      where: { user_id: userId, stock_symbol: symbol },
    });

    if (deleted === 0) {
      return res.status(404).json({ error: 'Stock not found in watchlist' });
    }

    res.json({ message: 'Stock removed from watchlist' });
  } catch (error) {
    console.error('Remove from watchlist error:', error);
    res.status(500).json({ error: 'Failed to remove from watchlist' });
  }
};
