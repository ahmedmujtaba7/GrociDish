// src/server.ts
import app from './app';
import dotenv from 'dotenv';
import { AppDataSource } from './config/db.config';
import 'reflect-metadata';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected');
  })
  .catch((err) => {
    console.error('Error during database initialization:', err);
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
