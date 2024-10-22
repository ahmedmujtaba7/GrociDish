import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes'; // Import user routes
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
console.log(1)
app.use('/api', userRoutes); // Apply user routes under /api

export default app;

