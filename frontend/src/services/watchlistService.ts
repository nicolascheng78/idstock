import api from './api';
import { Watchlist } from '../types';

export const watchlistService = {
  async getWatchlist(): Promise<{ watchlist: Watchlist[] }> {
    const response = await api.get('/watchlist');
    return response.data;
  },

  async addToWatchlist(stock_symbol: string): Promise<{ watchlist: Watchlist }> {
    const response = await api.post('/watchlist', { stock_symbol });
    return response.data;
  },

  async removeFromWatchlist(symbol: string): Promise<void> {
    await api.delete(`/watchlist/${symbol}`);
  },
};
