-- Indonesian Stock Market Platform (IDStock) Database Schema
-- PostgreSQL 14+

-- Create database
CREATE DATABASE idstock;
\c idstock;

-- Users table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Create indexes for users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verification_token ON users(verification_token);
CREATE INDEX idx_users_reset_token ON users(reset_password_token);

-- Portfolios table
CREATE TABLE portfolios (
    portfolio_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    average_price DECIMAL(15, 2) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    total_investment DECIMAL(15, 2) NOT NULL,
    current_value DECIMAL(15, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, stock_symbol)
);

-- Create indexes for portfolios
CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_stock_symbol ON portfolios(stock_symbol);

-- Transactions table
CREATE TABLE transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    transaction_type VARCHAR(4) NOT NULL CHECK (transaction_type IN ('BUY', 'SELL')),
    price DECIMAL(15, 2) NOT NULL CHECK (price > 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    transaction_date TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

-- Create indexes for transactions
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_stock_symbol ON transactions(stock_symbol);
CREATE INDEX idx_transactions_date ON transactions(transaction_date DESC);

-- Watchlists table
CREATE TABLE watchlists (
    watchlist_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, stock_symbol)
);

-- Create indexes for watchlists
CREATE INDEX idx_watchlists_user_id ON watchlists(user_id);
CREATE INDEX idx_watchlists_stock_symbol ON watchlists(stock_symbol);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for portfolios updated_at
CREATE TRIGGER update_portfolios_updated_at
    BEFORE UPDATE ON portfolios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data (for development/testing)
-- User: test@example.com, password: password123
INSERT INTO users (email, password_hash, full_name, is_verified) VALUES
('test@example.com', '$2a$10$YourHashedPasswordHere', 'Test User', true);

-- Comments
COMMENT ON TABLE users IS 'User accounts and authentication data';
COMMENT ON TABLE portfolios IS 'User stock holdings and portfolio data';
COMMENT ON TABLE transactions IS 'Buy/sell transaction history';
COMMENT ON TABLE watchlists IS 'User watchlist for stocks';

COMMENT ON COLUMN users.profile_data IS 'JSON field for additional user preferences and settings';
COMMENT ON COLUMN portfolios.average_price IS 'Weighted average price of stock holdings';
COMMENT ON COLUMN portfolios.total_investment IS 'Total amount invested in this stock';
COMMENT ON COLUMN portfolios.current_value IS 'Current market value (calculated from real-time price)';
