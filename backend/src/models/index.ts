import User from './User';
import Portfolio from './Portfolio';
import Transaction from './Transaction';
import Watchlist from './Watchlist';

// Define associations
User.hasMany(Portfolio, { foreignKey: 'user_id', as: 'portfolios' });
Portfolio.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(Watchlist, { foreignKey: 'user_id', as: 'watchlists' });
Watchlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { User, Portfolio, Transaction, Watchlist };
