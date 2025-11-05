import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { watchlistService } from '../services/watchlistService';
import { Portfolio, PortfolioSummary, Watchlist } from '../types';
import { toast } from 'react-hot-toast';

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [watchlist, setWatchlist] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [portfolioData, watchlistData] = await Promise.all([
        portfolioService.getPortfolio(),
        watchlistService.getWatchlist(),
      ]);
      
      setPortfolios(portfolioData.portfolios);
      setSummary(portfolioData.summary);
      setWatchlist(watchlistData.watchlist);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your portfolio overview and watchlist
        </p>
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
            <div className={`flex items-center text-2xl font-bold ${summary.total_profit_loss_percent >= 0 ? 'text-profit' : 'text-loss'}`}>
              {summary.total_profit_loss_percent >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              <span className="ml-2">
                {summary.total_profit_loss_percent >= 0 ? '+' : ''}{summary.total_profit_loss_percent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Top Holdings */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Top Holdings</h2>
        <div className="card overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-4">Stock</th>
                <th className="text-right py-3 px-4">Quantity</th>
                <th className="text-right py-3 px-4">Avg Price</th>
                <th className="text-right py-3 px-4">Current Price</th>
                <th className="text-right py-3 px-4">P/L</th>
              </tr>
            </thead>
            <tbody>
              {portfolios.slice(0, 5).map((portfolio) => (
                <tr key={portfolio.portfolio_id} className="border-b dark:border-gray-700">
                  <td className="py-3 px-4 font-semibold">{portfolio.stock_symbol}</td>
                  <td className="text-right py-3 px-4">{portfolio.quantity.toLocaleString()}</td>
                  <td className="text-right py-3 px-4">Rp {Number(portfolio.average_price).toLocaleString()}</td>
                  <td className="text-right py-3 px-4">Rp {portfolio.current_price?.toLocaleString() || '-'}</td>
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

      {/* Watchlist */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Watchlist</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div key={item.watchlist_id} className="card">
              <h3 className="text-lg font-semibold mb-2">{item.stock_symbol}</h3>
              {item.stock_data && (
                <>
                  <div className="text-2xl font-bold mb-2">
                    Rp {item.stock_data.price.toLocaleString()}
                  </div>
                  <div className={`text-sm ${item.stock_data.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                    {item.stock_data.change >= 0 ? '+' : ''}{item.stock_data.change.toFixed(2)} 
                    ({item.stock_data.changePercent.toFixed(2)}%)
                  </div>
                </>
              )}
            </div>
          ))}
          {watchlist.length === 0 && (
            <div className="card text-center text-gray-500">
              No stocks in watchlist yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
