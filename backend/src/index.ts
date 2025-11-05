import app from './app';
import config from './config';
import sequelize from './config/database';

const PORT = config.port;

// Initialize database and start server
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Sync database models
    // In production, use migrations instead
    if (config.nodeEnv === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database synchronized.');
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
