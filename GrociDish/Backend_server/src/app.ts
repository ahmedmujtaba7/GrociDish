import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRoutes from './routes/user.routes'; // Import user routes
import familyRoutes from './routes/family.routes';
import roleRoutes from './routes/role.routes';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.use(cors())
// Routes
app.use('/users', userRoutes);
app.use('/family', familyRoutes);
app.use('/roles', roleRoutes);
//app.use('/familyMembers', familyMemberRoutes);

export default app;

