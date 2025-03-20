import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import userRoutes from './routes/user.routes'; // Import user routes
import familyRoutes from './routes/family.routes';
import roleRoutes from './routes/role.routes';
import healthProfileRoutes from './routes/healthProfile.routes';
import caloricRoutes from './routes/caloric.routes'
import recipeRoutes from './routes/recipe.routes';
import groceryRoutes from './routes/grocery.routes';
import dotenv from 'dotenv';

import { Recipe } from './entities/Recipe';
import * as fs from 'fs';
import { AppDataSource } from './config/db.config';

dotenv.config();

const app: Application = express();

// Middleware
app.use(cookieParser());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.json());
app.use(cors({ origin: '*' }));



// Routes
app.use('/recipes', recipeRoutes);
app.use('/users', userRoutes);
app.use('/family', familyRoutes);
app.use('/roles', roleRoutes);
app.use('/healthProfile', healthProfileRoutes);
app.use('/caloric', caloricRoutes);
app.use('/grocery', groceryRoutes);

export default app;

