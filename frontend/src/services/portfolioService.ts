import api from './api';
import { Portfolio, PortfolioSummary, Transaction, AverageCalculation } from '../types';

export const portfolioService = {
  async getPortfolio(): Promise<{ portfolios: Portfolio[]; summary: PortfolioSummary }> {
    const response = await api.get('/portfolio');
    return response.data;
  },

  async addTransaction(data: {
    stock_symbol: string;
    transaction_type: 'BUY' | 'SELL';
    price: number;
    quantity: number;
    notes?: string;
  }): Promise<{ transaction: Transaction }> {
    const response = await api.post('/portfolio/transaction', data);
    return response.data;
  },

  async getTransactionHistory(): Promise<{ transactions: Transaction[] }> {
    const response = await api.get('/portfolio/transactions');
    return response.data;
  },

  async calculateAverage(data: {
    old_avg_price: number;
    old_quantity: number;
    new_price: number;
    new_quantity: number;
  }): Promise<AverageCalculation> {
    const response = await api.post('/portfolio/calculate-average', data);
    return response.data;
  },
};
