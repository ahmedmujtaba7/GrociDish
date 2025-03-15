import { Request, Response } from 'express';
import { MealHistoryService } from '../services/mealHistory.service';

export const storeSelectedMeal = async (req: Request, res: Response) => {
    const userId = res.locals.id; // Retrieved from auth middleware
    console.log('userId for storing recipe', userId);
    const { recipeId, mealType } = req.body;

    if (!userId || !recipeId || !mealType) {
      res.status(400).json({ message: 'userId, recipeId, and mealType are required' });
    }

    if (!['BREAKFAST', 'LUNCH', 'DINNER'].includes(mealType)) {
      res.status(400).json({ message: 'mealType must be BREAKFAST, LUNCH, or DINNER' });
    }
    console.log('storing recipe', recipeId, 'for mealType', mealType);
    try {
      console.log('user is: ', userId);
      const response = await MealHistoryService.storeSelectedMeal(userId, recipeId, mealType);
      res.status(200).json(response);
    } catch (error) {
      console.error('Error storing meal selection:', error);
      res.status(500).json({ message: 'Something went wrong!', error });
    }
};

