import axios from 'axios';
import config from '../config';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap?: number;
  high?: number;
  low?: number;
  open?: number;
  previousClose?: number;
}

export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

/**
 * Fetch real-time stock data for Indonesian stocks
 * This is a mock implementation - replace with actual Indonesian stock API
 */
export const getStockData = async (symbol: string): Promise<StockData> => {
  try {
    // Mock data for demonstration - replace with actual API call
    // Example: Yahoo Finance, Alpha Vantage, or Indonesian market specific APIs
    const mockData: StockData = {
      symbol: symbol.toUpperCase(),
      name: `${symbol} Company`,
      price: 1000 + Math.random() * 5000,
      change: (Math.random() - 0.5) * 100,
      changePercent: (Math.random() - 0.5) * 5,
      volume: Math.floor(Math.random() * 10000000),
      marketCap: Math.floor(Math.random() * 1000000000000),
      high: 1000 + Math.random() * 5000,
      low: 1000 + Math.random() * 5000,
      open: 1000 + Math.random() * 5000,
      previousClose: 1000 + Math.random() * 5000,
    };

    return mockData;
  } catch (error) {
    throw new Error(`Failed to fetch stock data for ${symbol}`);
  }
};

/**
 * Get multiple stocks data
 */
export const getMultipleStocks = async (symbols: string[]): Promise<StockData[]> => {
  const promises = symbols.map(symbol => getStockData(symbol));
  return Promise.all(promises);
};

/**
 * Get Indonesian market indices (IHSG, LQ45, IDX30)
 */
export const getMarketIndices = async (): Promise<IndexData[]> => {
  // Mock implementation - replace with actual API
  return [
    {
      name: 'IHSG',
      value: 7000 + Math.random() * 300,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 2,
    },
    {
      name: 'LQ45',
      value: 950 + Math.random() * 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 2,
    },
    {
      name: 'IDX30',
      value: 480 + Math.random() * 20,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 2,
    },
  ];
};

/**
 * Search stocks by query
 */
export const searchStocks = async (query: string): Promise<StockData[]> => {
  // Mock implementation - replace with actual search API
  const mockResults: StockData[] = [
    {
      symbol: 'BBCA',
      name: 'Bank Central Asia Tbk',
      price: 8500,
      change: 50,
      changePercent: 0.59,
      volume: 15000000,
    },
    {
      symbol: 'BBRI',
      name: 'Bank Rakyat Indonesia Tbk',
      price: 4500,
      change: -25,
      changePercent: -0.55,
      volume: 20000000,
    },
  ].filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );

  return mockResults;
};
