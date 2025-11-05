# API Documentation - IDStock Platform

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "full_name": "John Doe",
  "phone_number": "+62 812 3456 7890",
  "profile_data": {
    "investment_preference": "moderate"
  }
}
```

**Response (201):**
```json
{
  "message": "User created successfully. Please check your email for verification.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": false
  }
}
```

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "remember_me": true
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": true
  }
}
```

### POST /auth/verify-email
Verify user email address.

**Request Body:**
```json
{
  "token": "verification_token_from_email"
}
```

**Response (200):**
```json
{
  "message": "Email verified successfully"
}
```

### POST /auth/request-password-reset
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200):**
```json
{
  "message": "If the email exists, a reset link will be sent"
}
```

### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "new_password": "newpassword123"
}
```

**Response (200):**
```json
{
  "message": "Password reset successful"
}
```

---

## Portfolio Endpoints

### GET /portfolio
Get user's portfolio with current values. **[Protected]**

**Response (200):**
```json
{
  "portfolios": [
    {
      "portfolio_id": 1,
      "user_id": 1,
      "stock_symbol": "BBCA",
      "average_price": 8500.00,
      "quantity": 100,
      "total_investment": 850000.00,
      "current_price": 8750.00,
      "current_value": 875000.00,
      "profit_loss": 25000.00,
      "profit_loss_percent": 2.94
    }
  ],
  "summary": {
    "total_investment": 850000.00,
    "total_current_value": 875000.00,
    "total_profit_loss": 25000.00,
    "total_profit_loss_percent": 2.94
  }
}
```

### POST /portfolio/transaction
Add a buy or sell transaction. **[Protected]**

**Request Body:**
```json
{
  "stock_symbol": "BBCA",
  "transaction_type": "BUY",
  "price": 8500.00,
  "quantity": 100,
  "notes": "Initial purchase"
}
```

**Response (201):**
```json
{
  "message": "Transaction added successfully",
  "transaction": {
    "transaction_id": 1,
    "user_id": 1,
    "stock_symbol": "BBCA",
    "transaction_type": "BUY",
    "price": 8500.00,
    "quantity": 100,
    "transaction_date": "2024-01-15T10:30:00.000Z",
    "notes": "Initial purchase"
  }
}
```

### GET /portfolio/transactions
Get transaction history. **[Protected]**

**Response (200):**
```json
{
  "transactions": [
    {
      "transaction_id": 1,
      "user_id": 1,
      "stock_symbol": "BBCA",
      "transaction_type": "BUY",
      "price": 8500.00,
      "quantity": 100,
      "transaction_date": "2024-01-15T10:30:00.000Z",
      "notes": "Initial purchase"
    }
  ]
}
```

### POST /portfolio/calculate-average
Calculate new average price. **[Protected]**

**Request Body:**
```json
{
  "old_avg_price": 8500.00,
  "old_quantity": 100,
  "new_price": 8000.00,
  "new_quantity": 50
}
```

**Response (200):**
```json
{
  "newAverage": 8333.33,
  "totalInvestment": 1250000.00,
  "totalQuantity": 150
}
```

---

## Stock Data Endpoints

### GET /stocks/:symbol
Get real-time data for a specific stock.

**Response (200):**
```json
{
  "symbol": "BBCA",
  "name": "Bank Central Asia Tbk",
  "price": 8750.00,
  "change": 50.00,
  "changePercent": 0.57,
  "volume": 15000000,
  "marketCap": 1000000000000,
  "high": 8800.00,
  "low": 8700.00,
  "open": 8720.00,
  "previousClose": 8700.00
}
```

### GET /stocks/multiple?symbols=BBCA,BBRI
Get data for multiple stocks.

**Response (200):**
```json
[
  {
    "symbol": "BBCA",
    "name": "Bank Central Asia Tbk",
    "price": 8750.00,
    "change": 50.00,
    "changePercent": 0.57,
    "volume": 15000000
  },
  {
    "symbol": "BBRI",
    "name": "Bank Rakyat Indonesia Tbk",
    "price": 4520.00,
    "change": -20.00,
    "changePercent": -0.44,
    "volume": 20000000
  }
]
```

### GET /stocks/indices
Get Indonesian market indices.

**Response (200):**
```json
[
  {
    "name": "IHSG",
    "value": 7125.50,
    "change": 25.30,
    "changePercent": 0.36
  },
  {
    "name": "LQ45",
    "value": 975.20,
    "change": 5.10,
    "changePercent": 0.53
  },
  {
    "name": "IDX30",
    "value": 485.60,
    "change": 2.40,
    "changePercent": 0.50
  }
]
```

### GET /stocks/search?q=bank
Search for stocks.

**Response (200):**
```json
[
  {
    "symbol": "BBCA",
    "name": "Bank Central Asia Tbk",
    "price": 8750.00,
    "change": 50.00,
    "changePercent": 0.57,
    "volume": 15000000
  },
  {
    "symbol": "BBRI",
    "name": "Bank Rakyat Indonesia Tbk",
    "price": 4520.00,
    "change": -20.00,
    "changePercent": -0.44,
    "volume": 20000000
  }
]
```

---

## Watchlist Endpoints

### GET /watchlist
Get user's watchlist. **[Protected]**

**Response (200):**
```json
{
  "watchlist": [
    {
      "watchlist_id": 1,
      "user_id": 1,
      "stock_symbol": "BBCA",
      "created_at": "2024-01-15T10:30:00.000Z",
      "stock_data": {
        "symbol": "BBCA",
        "name": "Bank Central Asia Tbk",
        "price": 8750.00,
        "change": 50.00,
        "changePercent": 0.57
      }
    }
  ]
}
```

### POST /watchlist
Add stock to watchlist. **[Protected]**

**Request Body:**
```json
{
  "stock_symbol": "BBCA"
}
```

**Response (201):**
```json
{
  "message": "Stock added to watchlist",
  "watchlist": {
    "watchlist_id": 1,
    "user_id": 1,
    "stock_symbol": "BBCA",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### DELETE /watchlist/:symbol
Remove stock from watchlist. **[Protected]**

**Response (200):**
```json
{
  "message": "Stock removed from watchlist"
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

- Anonymous requests: 100 requests per 15 minutes
- Authenticated requests: 1000 requests per 15 minutes

## Notes

- All monetary values are in Indonesian Rupiah (IDR)
- Timestamps are in ISO 8601 format (UTC)
- Stock symbols follow IDX format (e.g., BBCA, BBRI)
- Price data updates every 5 seconds (configurable)
