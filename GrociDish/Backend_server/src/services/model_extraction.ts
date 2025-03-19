import axios from 'axios';

export class RecipeRecommendationService {
  static async recommendRecipes(userId: number, mealType: string) {
    try {
      const response = await axios.get(`http://localhost:8000/recommend-recipes/${userId}`, {
        params: { meal_type: mealType },
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.log("ML model not trained yet, falling back to rule-based recommendations.");
      return this.fallbackRecommendation(userId, mealType);
    }
  }

  static async fallbackRecommendation(userId: number, mealType: string) {
    // Implement rule-based recommendations (random selection)
    return { success: true, data: [{ recipe_id: 101, name: "Random Recipe" }] };
  }
}
