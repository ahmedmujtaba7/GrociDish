import { Request, Response } from 'express';
import { MealHistoryService } from '../services/mealHistory.service';

export const storeSelectedMeal = async (req: Request, res: Response) => {
    const userId = res.locals.userId; // Retrieved from auth middleware
    console.log('userId for storing recipe', userId);

    const { meals } = req.body; // Expecting an array of meals [{ recipeId, mealType }]
    
    if (!userId || !Array.isArray(meals) || meals.length === 0) {
        res.status(400).json({ message: 'Invalid request. Meals array is required.' });
    }

    try {
        const responses = [];

        for (const meal of meals) {
            const { recipeId, mealType } = meal;

            if (!recipeId || !mealType) {
                console.log(`Skipping meal entry: ${JSON.stringify(meal)} due to missing fields.`);
                continue; // Skip invalid entries
            }

            if (!['BREAKFAST', 'LUNCH', 'DINNER', 'LUNCH/DINNER'].includes(mealType)) {
                console.log(`Invalid mealType: ${mealType} for recipeId: ${recipeId}. Skipping.`);
                continue; // Skip invalid meal types
            }

            console.log(`Storing recipe ${recipeId} for mealType ${mealType}`);
            const response = await MealHistoryService.storeSelectedMeal(userId, recipeId, mealType);
            responses.push(response);
        }

        res.status(200).json({ message: 'Meal selections recorded successfully', data: responses });
    } catch (error) {
        console.error('Error storing meal selection:', error);
        res.status(500).json({ message: 'Something went wrong!', error });
    }
};
