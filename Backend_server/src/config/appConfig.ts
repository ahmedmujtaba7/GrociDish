export const APP_CONFIG = {
    PORT: process.env.PORT || 3000,
    ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret', // Ensure this is strong and secret in production
  };