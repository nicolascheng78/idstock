export interface User {
  id: number;
  email: string;
  full_name: string;
  is_verified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
  profile_data?: Record<string, any>;
}

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

export interface Portfolio {
  portfolio_id: number;
  user_id: number;
  stock_symbol: string;
  average_price: number;
  quantity: number;
  total_investment: number;
  current_price?: number;
  current_value?: number;
  profit_loss?: number;
  profit_loss_percent?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  transaction_id: number;
  user_id: number;
  stock_symbol: string;
  transaction_type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  transaction_date: string;
  notes?: string;
}

export interface Watchlist {
  watchlist_id: number;
  user_id: number;
  stock_symbol: string;
  stock_data?: StockData;
  created_at?: string;
}

export interface PortfolioSummary {
  total_investment: number;
  total_current_value: number;
  total_profit_loss: number;
  total_profit_loss_percent: number;
}

export interface AverageCalculation {
  newAverage: number;
  totalInvestment: number;
  totalQuantity: number;
}
