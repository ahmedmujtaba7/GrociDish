import express from 'express';
import { recommendRecipe, getRecipes } from '../controllers/recipe.controller';
import { updatePreference } from '../controllers/recipePreference.controller';
import { storeSelectedMeal } from '../controllers/mealHistory.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = express.Router();

// Assign roles to family members
router.post('/recipeRecommendation', authenticateToken, recommendRecipe);
router.post('/updatePreference', authenticateToken, updatePreference);
router.post('/storeSelectedMeal', authenticateToken, storeSelectedMeal);
router.get('/getRecipe', authenticateToken, getRecipes);
export default router;