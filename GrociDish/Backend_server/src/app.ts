import express, { Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes'; // Import user routes
import familyMemberRoutes from './routes/familyMember.routes'
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.use('/users', userRoutes);
app.use('/familyMembers', familyMemberRoutes);

export default app;

