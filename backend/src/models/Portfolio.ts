import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface PortfolioAttributes {
  portfolio_id: number;
  user_id: number;
  stock_symbol: string;
  average_price: number;
  quantity: number;
  total_investment: number;
  current_value?: number;
  created_at?: Date;
  updated_at?: Date;
}

interface PortfolioCreationAttributes extends Optional<PortfolioAttributes, 'portfolio_id' | 'created_at' | 'updated_at'> {}

class Portfolio extends Model<PortfolioAttributes, PortfolioCreationAttributes> implements PortfolioAttributes {
  public portfolio_id!: number;
  public user_id!: number;
  public stock_symbol!: string;
  public average_price!: number;
  public quantity!: number;
  public total_investment!: number;
  public current_value?: number;
  public created_at?: Date;
  public updated_at?: Date;
}

Portfolio.init(
  {
    portfolio_id: {
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
    average_price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_investment: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    current_value: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'portfolios',
    timestamps: false,
  }
);

export default Portfolio;
