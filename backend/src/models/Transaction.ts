import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface TransactionAttributes {
  transaction_id: number;
  user_id: number;
  stock_symbol: string;
  transaction_type: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  transaction_date: Date;
  notes?: string;
}

interface TransactionCreationAttributes extends Optional<TransactionAttributes, 'transaction_id'> {}

class Transaction extends Model<TransactionAttributes, TransactionCreationAttributes> implements TransactionAttributes {
  public transaction_id!: number;
  public user_id!: number;
  public stock_symbol!: string;
  public transaction_type!: 'BUY' | 'SELL';
  public price!: number;
  public quantity!: number;
  public transaction_date!: Date;
  public notes?: string;
}

Transaction.init(
  {
    transaction_id: {
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
    transaction_type: {
      type: DataTypes.ENUM('BUY', 'SELL'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    timestamps: false,
  }
);

export default Transaction;
