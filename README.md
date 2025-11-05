# Indonesian Stock Market Platform (IDStock)

A comprehensive, professional-grade Indonesian stock market platform with real-time data, portfolio tracking, and investment tools.

## 🎯 Features

### Core Functionality
- **Real-time Stock Data**: Live Indonesian stock market data (IHSG, LQ45, IDX30)
- **User Authentication**: Secure signup/login with email verification
- **Portfolio Tracking**: Real-time portfolio value and profit/loss calculations
- **Average Calculator**: Calculate new average price when adding shares
- **Watchlist**: Track your favorite stocks
- **Transaction History**: Complete record of all buy/sell transactions

### Technical Highlights
- Modern React frontend with TypeScript
- Node.js/Express backend API
- PostgreSQL database with Sequelize ORM
- JWT authentication
- Professional UI with Tailwind CSS
- Dark/light mode support
- Responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/nicolascheng78/idstock.git
cd idstock
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials and configuration
npm run build
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

4. **Setup Database**
```bash
# Create PostgreSQL database
createdb idstock

# Run migrations (in development mode, tables are auto-created)
```

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=idstock
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

REDIS_HOST=localhost
REDIS_PORT=6379

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

STOCK_API_KEY=your_stock_api_key
STOCK_API_URL=https://api.stockdata.org/v1

FRONTEND_URL=http://localhost:5173
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📊 Database Schema

See [docs/database-schema.sql](docs/database-schema.sql) for complete schema.

### Tables
- **users**: User accounts and authentication
- **portfolios**: Stock holdings and portfolio data
- **transactions**: Buy/sell transaction history
- **watchlists**: User watchlist for stocks

## 🏗️ Project Structure

```
idstock/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   ├── app.ts          # Express app setup
│   │   └── index.ts        # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # State management
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
│
└── docs/                   # Documentation
```

## 🔌 API Endpoints

See [docs/API.md](docs/API.md) for complete API documentation.

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify-email` - Verify email

### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio/transaction` - Add transaction
- `POST /api/portfolio/calculate-average` - Calculate average price

### Stocks
- `GET /api/stocks/:symbol` - Get stock data
- `GET /api/stocks/indices` - Get market indices
- `GET /api/stocks/search` - Search stocks

### Watchlist
- `GET /api/watchlist` - Get watchlist
- `POST /api/watchlist` - Add to watchlist

## 🧮 Average Calculator Algorithm

The platform implements the weighted average formula:

```python
def calculate_new_average(old_avg_price, old_quantity, new_price, new_quantity):
    total_investment = (old_avg_price * old_quantity) + (new_price * new_quantity)
    total_quantity = old_quantity + new_quantity
    new_average = total_investment / total_quantity
    return new_average
```

**Example:**
- Current: 100 shares @ Rp 5,000 (Total: Rp 500,000)
- New: 50 shares @ Rp 4,000 (Additional: Rp 200,000)
- New average: Rp 700,000 ÷ 150 shares = Rp 4,666.67

## 🎨 Design System

### Colors
- **Primary**: Blue (#3b82f6) - Professional, trustworthy
- **Profit**: Green (#10b981) - Positive returns
- **Loss**: Red (#ef4444) - Negative returns

### Components
- Card-based layouts for data presentation
- Responsive tables for portfolio/transaction views
- Modal dialogs for forms
- Toast notifications for user feedback

## 🔒 Security

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for authentication
- Input validation with express-validator
- SQL injection prevention via Sequelize ORM
- XSS protection via React
- CORS configuration

## 📦 Deployment

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to static hosting
```

## 🌟 Future Enhancements

- [ ] Real Indonesian stock API integration (IDX, RTI)
- [ ] WebSocket for real-time price updates
- [ ] Technical analysis charts (candlestick, indicators)
- [ ] Price alerts and notifications
- [ ] Social features (share portfolios)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics and reporting
- [ ] Export data (CSV, PDF)
- [ ] Multi-language support

## 📄 License

MIT License

## 📧 Support

For support, create an issue on GitHub.

---

**Built with ❤️ for Indonesian investors**