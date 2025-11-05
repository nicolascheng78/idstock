import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface WatchlistAttributes {
  watchlist_id: number;
  user_id: number;
  stock_symbol: string;
  created_at?: Date;
}

interface WatchlistCreationAttributes extends Optional<WatchlistAttributes, 'watchlist_id' | 'created_at'> {}

class Watchlist extends Model<WatchlistAttributes, WatchlistCreationAttributes> implements WatchlistAttributes {
  public watchlist_id!: number;
  public user_id!: number;
  public stock_symbol!: string;
  public created_at?: Date;
}

Watchlist.init(
  {
    watchlist_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    stock_symbol: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'watchlists',
    timestamps: false,
  }
);

export default Watchlist;
