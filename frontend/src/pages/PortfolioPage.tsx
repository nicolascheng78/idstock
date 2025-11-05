import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { Portfolio, PortfolioSummary, Transaction } from '../types';
import { toast } from 'react-hot-toast';

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    stock_symbol: '',
    transaction_type: 'BUY' as 'BUY' | 'SELL',
    price: '',
    quantity: '',
    notes: '',
  });

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      const [portfolioData, transactionData] = await Promise.all([
        portfolioService.getPortfolio(),
        portfolioService.getTransactionHistory(),
      ]);
      
      setPortfolios(portfolioData.portfolios);
      setSummary(portfolioData.summary);
      setTransactions(transactionData.transactions);
    } catch (error) {
      toast.error('Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await portfolioService.addTransaction({
        stock_symbol: formData.stock_symbol.toUpperCase(),
        transaction_type: formData.transaction_type,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        notes: formData.notes,
      });
      
      toast.success('Transaction added successfully');
      setShowAddModal(false);
      setFormData({
        stock_symbol: '',
        transaction_type: 'BUY',
        price: '',
        quantity: '',
        notes: '',
      });
      loadPortfolioData();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add transaction');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your stock holdings and transactions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Transaction
        </button>
      </div>

      {/* Portfolio Summary */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Investment</h3>
            <div className="text-2xl font-bold">
              Rp {summary.total_investment.toLocaleString()}
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Value</h3>
            <div className="text-2xl font-bold">
              Rp {summary.total_current_value.toLocaleString()}
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Profit/Loss</h3>
            <div className={`text-2xl font-bold ${summary.total_profit_loss >= 0 ? 'text-profit' : 'text-loss'}`}>
              {summary.total_profit_loss >= 0 ? '+' : ''}Rp {summary.total_profit_loss.toLocaleString()}
            </div>
          </div>
          <div className="card">
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Return</h3>
            <div className={`text-2xl font-bold ${summary.total_profit_loss_percent >= 0 ? 'text-profit' : 'text-loss'}`}>
              {summary.total_profit_loss_percent >= 0 ? '+' : ''}{summary.total_profit_loss_percent.toFixed(2)}%
            </div>
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Current Holdings</h2>
        <div className="card overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Avg Price</th>
                <th className="text-right py-3 px-4">Current Price</th>
                <th className="text-right py-3 px-4">Investment</th>
                <th className="text-right py-3 px-4">Current Value</th>
                <th className="text-right py-3 px-4">P/L</th>
                <th className="text-right py-3 px-4">P/L %</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio.portfolio_id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4 font-semibold">{portfolio.stock_symbol}</td>
                  <td className="text-right py-3 px-4">{portfolio.quantity.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">Rp {Number(portfolio.average_price).toLocaleString()}</td>
                  <td className="text-right py-3 px-4">Rp {portfolio.current_price?.toLocaleString() || '-'}</td>
                  <td className="text-right py-3 px-4">Rp {Number(portfolio.total_investment).toLocaleString()}</td>
                  <td className="text-right py-3 px-4">Rp {portfolio.current_value?.toLocaleString() || '-'}</td>
                  <td className={`text-right py-3 px-4 ${(portfolio.profit_loss || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {portfolio.profit_loss !== undefined
                      ? `${portfolio.profit_loss >= 0 ? '+' : ''}Rp ${Math.abs(portfolio.profit_loss).toLocaleString()}`
                      : '-'}
                  </td>
                  <td className={`text-right py-3 px-4 ${(portfolio.profit_loss_percent || 0) >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {portfolio.profit_loss_percent !== undefined
                      ? `${portfolio.profit_loss_percent >= 0 ? '+' : ''}${portfolio.profit_loss_percent.toFixed(2)}%`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {portfolios.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No holdings yet. Add your first transaction!
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
        <div className="card overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4">Date</th>
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-left py-3 px-4">Type</th>
                <th className="text-right py-3 px-4">Price</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Total</th>
                <th className="text-left py-3 px-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.transaction_id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4">{new Date(tx.transaction_date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 font-semibold">{tx.stock_symbol}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      tx.transaction_type === 'BUY' ? 'bg-profit/20 text-profit' : 'bg-loss/20 text-loss'
                    }`}>
                      {tx.transaction_type}
                    </span>
                  </td>
                  <td className="text-right py-3 px-4">Rp {Number(tx.price).toLocaleString()}</td>
                  <td className="text-right py-3 px-4">{tx.quantity.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">Rp {(Number(tx.price) * tx.quantity).toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{tx.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions yet
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="label">Stock Symbol</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., BBCA"
                  value={formData.stock_symbol}
                  onChange={(e) => setFormData({ ...formData, stock_symbol: e.target.value.toUpperCase() })}
                  required
                />
              </div>
              
              <div>
                <label className="label">Transaction Type</label>
                <select
                  className="input"
                  value={formData.transaction_type}
                  onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value as 'BUY' | 'SELL' })}
                >
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>

              <div>
                <label className="label">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="input"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  className="input"
                  placeholder="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="label">Notes (Optional)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="Additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
