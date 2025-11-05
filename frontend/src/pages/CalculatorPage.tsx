import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { toast } from 'react-hot-toast';

export default function CalculatorPage() {
  const [formData, setFormData] = useState({
    old_avg_price: '',
    old_quantity: '',
    new_price: '',
    new_quantity: '',
  });

  const [result, setResult] = useState<{
    newAverage: number;
    totalInvestment: number;
    totalQuantity: number;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const calculation = await portfolioService.calculateAverage({
        old_avg_price: parseFloat(formData.old_avg_price) || 0,
        old_quantity: parseInt(formData.old_quantity) || 0,
        new_price: parseFloat(formData.new_price),
        new_quantity: parseInt(formData.new_quantity),
      });

      setResult(calculation);
    } catch (error) {
      toast.error('Calculation failed');
    }
  };

  const handleReset = () => {
    setFormData({
      old_avg_price: '',
      old_quantity: '',
      new_price: '',
      new_quantity: '',
    });
    setResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Average Price Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your new average price when adding more shares to your position
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calculator Form */}
        <div className="card">
          <div className="flex items-center gap-2 mb-6">
            <Calculator className="text-primary-600" size={24} />
            <h2 className="text-2xl font-bold">Calculator</h2>
          </div>

          <form onSubmit={handleCalculate} className="space-y-4">
            <div>
              <label className="label">Old Average Price (Rp)</label>
              <input
                type="number"
                name="old_avg_price"
                step="0.01"
                className="input"
                placeholder="0.00"
                value={formData.old_avg_price}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Your current average price per share (leave empty if this is your first purchase)</p>
            </div>

            <div>
              <label className="label">Old Quantity</label>
              <input
                type="number"
                name="old_quantity"
                className="input"
                placeholder="0"
                value={formData.old_quantity}
                onChange={handleChange}
              />
              <p className="text-xs text-gray-500 mt-1">Number of shares you currently own (leave empty if this is your first purchase)</p>
            </div>

            <div className="border-t dark:border-gray-700 pt-4">
              <label className="label">New Purchase Price (Rp)</label>
              <input
                type="number"
                name="new_price"
                step="0.01"
                className="input"
                placeholder="0.00"
                value={formData.new_price}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Price per share for your new purchase</p>
            </div>

            <div>
              <label className="label">New Quantity</label>
              <input
                type="number"
                name="new_quantity"
                className="input"
                placeholder="0"
                value={formData.new_quantity}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Number of shares you're buying</p>
            </div>

            <div className="flex gap-2 pt-4">
              <button type="submit" className="btn btn-primary flex-1">
                Calculate
              </button>
              <button type="button" onClick={handleReset} className="btn btn-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Results</h2>
          
          {result ? (
            <div className="space-y-6">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">New Average Price</h3>
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  Rp {result.newAverage.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Quantity</h3>
                  <div className="text-2xl font-bold">
                    {result.totalQuantity.toLocaleString()}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Investment</h3>
                  <div className="text-2xl font-bold">
                    Rp {result.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="pt-4 border-t dark:border-gray-700">
                <h3 className="font-semibold mb-3">Calculation Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Previous Investment:</span>
                    <span className="font-medium">
                      Rp {((parseFloat(formData.old_avg_price) || 0) * (parseInt(formData.old_quantity) || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">New Investment:</span>
                    <span className="font-medium">
                      Rp {(parseFloat(formData.new_price) * parseInt(formData.new_quantity)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t dark:border-gray-700 font-semibold">
                    <span>Total:</span>
                    <span>Rp {result.totalInvestment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calculator size={48} className="mx-auto mb-4 opacity-50" />
              <p>Enter values and click Calculate to see results</p>
            </div>
          )}
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <p>
            The average price calculator uses the weighted average formula to determine your new cost basis when you add more shares to an existing position:
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm">
            <p className="mb-2">Total Investment = (Old Avg Price × Old Quantity) + (New Price × New Quantity)</p>
            <p className="mb-2">Total Quantity = Old Quantity + New Quantity</p>
            <p>New Average = Total Investment ÷ Total Quantity</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Example:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>You own 100 shares at Rp 5,000 average price (Total: Rp 500,000)</li>
              <li>You buy 50 more shares at Rp 4,000 (Additional: Rp 200,000)</li>
              <li>New average: (Rp 500,000 + Rp 200,000) ÷ 150 shares = Rp 4,666.67</li>
            </ul>
          </div>

          <p className="text-sm italic">
            This calculator is useful for implementing dollar-cost averaging strategies and tracking your true cost basis for tax and investment analysis purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
