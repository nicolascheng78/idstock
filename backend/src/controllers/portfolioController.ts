import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Portfolio, Transaction } from '../models';
import { calculateNewAverage, calculateProfitLoss } from '../utils/calculator';
import { getStockData, getMultipleStocks } from '../services/stockService';

export const getPortfolio = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const portfolios = await Portfolio.findAll({ where: { user_id: userId } });

    // Get current prices for all stocks
    const symbols = portfolios.map(p => p.stock_symbol);
    const stockData = await getMultipleStocks(symbols);

    const enrichedPortfolios = portfolios.map(portfolio => {
      const stock = stockData.find(s => s.symbol === portfolio.stock_symbol);
      const currentPrice = stock?.price || 0;
      
      const pl = calculateProfitLoss(
        Number(portfolio.average_price),
        currentPrice,
        portfolio.quantity
      );

      return {
        ...portfolio.toJSON(),
        current_price: currentPrice,
        current_value: pl.totalValue,
        profit_loss: pl.absolutePL,
        profit_loss_percent: pl.percentagePL,
      };
    });

    const totalInvestment = portfolios.reduce((sum, p) => sum + Number(p.total_investment), 0);
    const totalCurrentValue = enrichedPortfolios.reduce((sum, p) => sum + p.current_value, 0);
    const totalPL = totalCurrentValue - totalInvestment;
    const totalPLPercent = (totalPL / totalInvestment) * 100;

    res.json({
      portfolios: enrichedPortfolios,
      summary: {
        total_investment: totalInvestment,
        total_current_value: totalCurrentValue,
        total_profit_loss: totalPL,
        total_profit_loss_percent: totalPLPercent,
      },
    });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { stock_symbol, transaction_type, price, quantity, notes } = req.body;

    // Create transaction record
    const transaction = await Transaction.create({
      user_id: userId,
      stock_symbol,
      transaction_type,
      price,
      quantity,
      transaction_date: new Date(),
      notes,
    });

    // Update or create portfolio entry
    if (transaction_type === 'BUY') {
      const existingPortfolio = await Portfolio.findOne({
        where: { user_id: userId, stock_symbol },
      });

      if (existingPortfolio) {
        // Calculate new average
        const { newAverage, totalInvestment, totalQuantity } = calculateNewAverage(
          Number(existingPortfolio.average_price),
          existingPortfolio.quantity,
          price,
          quantity
        );

        existingPortfolio.average_price = newAverage;
        existingPortfolio.quantity = totalQuantity;
        existingPortfolio.total_investment = totalInvestment;
        existingPortfolio.updated_at = new Date();
        await existingPortfolio.save();
      } else {
        // Create new portfolio entry
        await Portfolio.create({
          user_id: userId,
          stock_symbol,
          average_price: price,
          quantity,
          total_investment: price * quantity,
        });
      }
    } else if (transaction_type === 'SELL') {
      const portfolio = await Portfolio.findOne({
        where: { user_id: userId, stock_symbol },
      });

      if (portfolio) {
        portfolio.quantity -= quantity;
        if (portfolio.quantity <= 0) {
          await portfolio.destroy();
        } else {
          portfolio.total_investment = Number(portfolio.average_price) * portfolio.quantity;
          portfolio.updated_at = new Date();
          await portfolio.save();
        }
      }
    }

    res.status(201).json({
      message: 'Transaction added successfully',
      transaction,
    });
  } catch (error) {
    console.error('Add transaction error:', error);
    res.status(500).json({ error: 'Failed to add transaction' });
  }
};

export const getTransactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const transactions = await Transaction.findAll({
      where: { user_id: userId },
      order: [['transaction_date', 'DESC']],
    });

    res.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

export const calculateAverage = async (req: AuthRequest, res: Response) => {
  try {
    const { old_avg_price, old_quantity, new_price, new_quantity } = req.body;

    const result = calculateNewAverage(old_avg_price, old_quantity, new_price, new_quantity);

    res.json(result);
  } catch (error) {
    console.error('Calculate average error:', error);
    res.status(500).json({ error: 'Failed to calculate average' });
  }
};
