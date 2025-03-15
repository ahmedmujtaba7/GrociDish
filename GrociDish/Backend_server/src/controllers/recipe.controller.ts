import { Request, Response } from 'express';
import { RecipeRecommendationService } from '../services/recipe.service';

export const recommendRecipe= async (req: Request, res: Response) => {
  const userId = res.locals.id; // Retrieved from auth middleware
  try {
      const RecommendedRecipe = await RecipeRecommendationService.recommendRecipes(userId);
      res.status(200).json({ success: true, data: RecommendedRecipe });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error getting recipes" });
    }
}

export const getRecipes= async (req: Request, res: Response) => {
  let { page, limit, category, ingredientType, foodType, disease } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    try {
      const recipes = await RecipeRecommendationService.getRecipes(pageNumber, limitNumber, category as string, ingredientType as string, foodType as string, disease as string);
      res.status(200).json(recipes);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      res.status(500).json({ message: 'Something went wrong!', error});
    }
}





