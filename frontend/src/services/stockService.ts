import api from './api';
import { StockData, IndexData } from '../types';

export const stockService = {
  async getStock(symbol: string): Promise<StockData> {
    const response = await api.get(`/stocks/${symbol}`);
    return response.data;
  },

  async getMultipleStocks(symbols: string[]): Promise<StockData[]> {
    const response = await api.get(`/stocks/multiple?symbols=${symbols.join(',')}`);
    return response.data;
  },

  async getIndices(): Promise<IndexData[]> {
    const response = await api.get('/stocks/indices');
    return response.data;
  },

  async searchStocks(query: string): Promise<StockData[]> {
    const response = await api.get(`/stocks/search?q=${query}`);
    return response.data;
  },
};
