import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Search } from 'lucide-react';
import { stockService } from '../services/stockService';
import { StockData, IndexData } from '../types';
import { toast } from 'react-hot-toast';

export default function HomePage() {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadIndices();
  }, []);

  const loadIndices = async () => {
    try {
      const data = await stockService.getIndices();
      setIndices(data);
    } catch (error) {
      console.error('Failed to load indices:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const results = await stockService.searchStocks(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Indonesian Stock Market Platform
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Real-time market data, portfolio tracking, and investment tools
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Search stocks (e.g., BBCA, BBRI)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className="btn btn-primary" disabled={loading}>
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Market Indices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {indices.map((index) => (
            <div key={index.name} className="card">
              <h3 className="text-lg font-semibold mb-2">{index.name}</h3>
              <div className="text-3xl font-bold mb-2">
                {index.value.toFixed(2)}
              </div>
              <div className={`flex items-center ${index.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                {index.change >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span className="ml-2">
                  {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((stock) => (
              <div key={stock.symbol} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stock.name}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">
                      Rp {stock.price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${stock.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Volume: {stock.volume.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
        <div className="card text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-semibold mb-2">Real-Time Data</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Access live stock prices and market movements
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">💼</div>
          <h3 className="text-xl font-semibold mb-2">Portfolio Tracking</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your investments and track performance
          </p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🧮</div>
          <h3 className="text-xl font-semibold mb-2">Advanced Calculator</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Calculate average prices and investment returns
          </p>
        </div>
      </div>
    </div>
  );
}
