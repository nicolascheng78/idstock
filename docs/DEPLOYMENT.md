# Deployment Guide - IDStock Platform

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Domain name (optional, for production)
- Email service credentials (Gmail, SendGrid, etc.)
- Cloud hosting account (AWS, DigitalOcean, Heroku, etc.)

## Backend Deployment

### 1. Prepare Environment

Create a `.env` file with production values:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (use managed PostgreSQL in production)
DB_HOST=your-postgres-host.com
DB_PORT=5432
DB_NAME=idstock
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# JWT (IMPORTANT: Use a strong secret in production)
JWT_SECRET=your_strong_random_secret_key_here
JWT_EXPIRES_IN=7d

# Redis (optional, for caching)
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stock API (replace with real Indonesian stock API)
STOCK_API_KEY=your_stock_api_key
STOCK_API_URL=https://api.indonesianstocks.com/v1

# Frontend URL (your deployed frontend domain)
FRONTEND_URL=https://your-domain.com
```

### 2. Build Backend

```bash
cd backend
npm install --production
npm run build
```

### 3. Setup Database

Run the database schema:

```bash
psql -h your-postgres-host -U your_db_user -d idstock -f ../docs/database-schema.sql
```

Or let Sequelize auto-sync (development only):
```bash
# The app will auto-create tables on first run in development mode
```

### 4. Deploy Backend

#### Option A: Traditional Server (VPS)

```bash
# Install PM2 for process management
npm install -g pm2

# Start the application
pm2 start dist/index.js --name idstock-api

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

#### Option B: Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]
```

Build and run:

```bash
docker build -t idstock-backend .
docker run -p 5000:5000 --env-file .env idstock-backend
```

#### Option C: Heroku

```bash
# Install Heroku CLI
heroku create idstock-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
# ... set all other env vars

# Deploy
git push heroku main
```

#### Option D: AWS Elastic Beanstalk, DigitalOcean App Platform, etc.

Follow platform-specific deployment guides.

### 5. Setup Nginx (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 6. Setup SSL Certificate

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.your-domain.com
```

## Frontend Deployment

### 1. Build Frontend

Update `.env` with production API URL:

```env
VITE_API_URL=https://api.your-domain.com/api
```

Build:

```bash
cd frontend
npm install
npm run build
```

This creates a `dist/` folder with optimized static files.

### 2. Deploy Frontend

#### Option A: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

#### Option C: AWS S3 + CloudFront

```bash
# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Configure CloudFront distribution
# Set up custom domain and SSL certificate
```

#### Option D: Nginx (Static Files)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/idstock/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Database Setup

### PostgreSQL (Managed Services)

Recommended providers:
- AWS RDS PostgreSQL
- DigitalOcean Managed Databases
- Heroku Postgres
- Google Cloud SQL

### Database Migrations

In production, use proper migrations instead of auto-sync:

```bash
# Install Sequelize CLI
npm install -g sequelize-cli

# Generate migration
sequelize migration:generate --name create-initial-tables

# Run migrations
sequelize db:migrate
```

### Database Backups

Setup automated backups:

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump -h your-host -U your-user idstock > backup-$DATE.sql
```

## Email Service Setup

### Gmail (Development/Small Scale)

1. Enable 2-factor authentication
2. Generate App Password
3. Use in EMAIL_PASSWORD env variable

### SendGrid (Production)

1. Sign up at sendgrid.com
2. Get API key
3. Update email service in `backend/src/utils/email.ts`

### AWS SES (Production)

1. Set up AWS SES
2. Verify domain
3. Update email service configuration

## Stock API Integration

Replace mock data in `backend/src/services/stockService.ts` with real API:

### Option 1: Yahoo Finance API

```typescript
import yahooFinance from 'yahoo-finance2';

export const getStockData = async (symbol: string): Promise<StockData> => {
  const quote = await yahooFinance.quote(`${symbol}.JK`); // .JK for Jakarta Stock Exchange
  return {
    symbol: quote.symbol,
    name: quote.shortName || quote.longName || symbol,
    price: quote.regularMarketPrice || 0,
    change: quote.regularMarketChange || 0,
    changePercent: quote.regularMarketChangePercent || 0,
    volume: quote.regularMarketVolume || 0,
    // ... map other fields
  };
};
```

### Option 2: Alpha Vantage

```typescript
const API_KEY = process.env.STOCK_API_KEY;
const response = await axios.get(
  `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}.JK&apikey=${API_KEY}`
);
```

### Option 3: Indonesian Market-Specific APIs

Research and integrate with:
- RTI Business (Indonesian market data provider)
- IDX official API
- Other Indonesian financial data providers

## Monitoring and Logging

### Application Monitoring

```bash
# Install monitoring tools
npm install winston morgan

# Setup logging in production
# Configure error tracking (Sentry, LogRocket, etc.)
```

### Server Monitoring

- Use PM2 monitoring
- Setup alerts for downtime
- Monitor database performance
- Track API response times

## Security Checklist

- [ ] Use strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Implement rate limiting
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable database connection encryption
- [ ] Implement API authentication
- [ ] Add input validation
- [ ] Setup firewall rules
- [ ] Regular security audits

## Performance Optimization

### Backend

```bash
# Enable compression
npm install compression

# Add to app.ts
import compression from 'compression';
app.use(compression());
```

### Frontend

- Already optimized with Vite
- Lazy loading routes
- Code splitting
- Gzip compression
- CDN for static assets

### Database

- Add indexes (already in schema)
- Connection pooling (configured in Sequelize)
- Query optimization
- Regular VACUUM and ANALYZE

## Scaling

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Run multiple backend instances
- Session storage in Redis
- Stateless API design

### Vertical Scaling

- Increase server resources
- Optimize database queries
- Add caching layer (Redis)

## Backup and Recovery

### Database Backups

```bash
# Automated daily backups
0 2 * * * /usr/bin/pg_dump -h host -U user idstock > /backups/idstock-$(date +\%Y\%m\%d).sql
```

### Application Backups

- Version control (Git)
- Docker images
- Configuration backups

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test portfolio calculations
- [ ] Check email delivery
- [ ] Test stock data updates
- [ ] Verify database connections
- [ ] Test responsive design
- [ ] Check SSL certificate
- [ ] Monitor error logs
- [ ] Setup analytics (Google Analytics, etc.)
- [ ] Configure backups
- [ ] Document API for users
- [ ] Create user documentation

## Troubleshooting

### Common Issues

**Database Connection Failed:**
- Check DATABASE_URL or individual DB_* env vars
- Verify firewall allows connections
- Check database credentials

**Email Not Sending:**
- Verify email credentials
- Check spam folder
- Enable "less secure apps" (Gmail) or use App Password

**CORS Errors:**
- Update FRONTEND_URL in backend .env
- Check CORS configuration in app.ts

**JWT Token Errors:**
- Verify JWT_SECRET is set
- Check token expiration

## Support and Maintenance

### Regular Tasks

- Weekly: Check logs for errors
- Monthly: Update dependencies
- Quarterly: Security audit
- Yearly: Database optimization

### Updates

```bash
# Check for security updates
npm audit

# Update dependencies
npm update

# Rebuild and redeploy
npm run build
```

---

For more information, see:
- [README.md](../README.md) - General information
- [API.md](./API.md) - API documentation
- [database-schema.sql](./database-schema.sql) - Database schema
