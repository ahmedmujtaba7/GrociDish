import { Request, Response } from 'express';
import { RecipePreferenceService } from '../services/recipePreference.service';


export const updatePreference = async (req: Request, res: Response) => {
  try {
    const userId  = res.locals.userId; // Retrieved from auth middleware
    const { recipeId, preference } = req.body;

    console.log("🔹 Received API Request:", { userId, recipeId, preference });

    if (!userId || !recipeId || !preference) {
      console.error("❌ Missing fields in request");
      res.status(400).json({ message: 'userId, recipeId, and preference are required' });
    }

    if (!['LIKE', 'DISLIKE', 'REMOVE'].includes(preference)) {
      console.error("❌ Invalid preference value:", preference);
      res.status(400).json({ message: 'Preference must be LIKE, DISLIKE, or REMOVE' });
    }
    console.log("user is ", userId);
    const updatedPreference = await RecipePreferenceService.updatePreference(userId, recipeId, preference);

    console.log("✅ Preference Updated Successfully:", updatedPreference);
    res.status(200).json({ message: 'Preference updated successfully', updatedPreference });

  } catch (error) {
    console.error("❌ Error updating preference:", error);
    res.status(500).json({ message: 'Error updating preference', error});
  }
};
