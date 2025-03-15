import { AppDataSource } from '../config/db.config';
import { MealHistory } from '../entities/MealHistory';
import { FamilyMember } from '../entities/FamilyMember';
import { Recipe } from '../entities/Recipe';
import { HealthProfile } from '../entities/HealthProfile';
import { CaloricInformation } from '../entities/CaloricInformation';

export class MealHistoryService {
  static async storeSelectedMeal(userId: number, recipeId: number, mealType: string) {
    const mealHistoryRepository = AppDataSource.getRepository(MealHistory);
    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const healthProfileRepository = AppDataSource.getRepository(HealthProfile);
    const caloricInfoRepository = AppDataSource.getRepository(CaloricInformation);

    // Find the family of the user
    const familyMember = await familyMemberRepository.findOne({
      where: { user: { id: userId } },
      relations: ['family'],
    });

    if (!familyMember || !familyMember.family) {
      throw new Error('User does not belong to any family.');
    }

    const familyId = familyMember.family.id;

    // Check if the recipe exists
    const recipe = await recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new Error('Recipe not found.');
    }

    // **Fix: Ensure mealType consistency for "LUNCH/DINNER"**
    if (mealType === 'LUNCH' || mealType === 'DINNER') {
      mealType = 'LUNCH/DINNER';
    }

    // **Fix: Multiply calorie/macronutrient values by family size**
    const familyMembers = await familyMemberRepository.find({
      where: { family: { id: familyId } },
      relations: ['user'],
    });
    const memberCount = familyMembers.length;

    const totalCalories = recipe.caloriesPerServing * memberCount;
    const totalCarbs = recipe.carbohydrates * memberCount;
    const totalProteins = recipe.proteins * memberCount;
    const totalFats = recipe.fats * memberCount;

    // Store meal selection in history
    const mealRecord = mealHistoryRepository.create({
      family: { id: familyId },
      recipe: { id: recipeId },
      mealType,
      selected: true,
    });

    await mealHistoryRepository.save(mealRecord);

    // **Update caloric information for each family member**
    for (const member of familyMembers) {
      const healthProfile = await healthProfileRepository.findOne({
        where: { user: { id: member.user.id } },
        relations: ['caloricInformation'],
      });

      if (healthProfile && healthProfile.caloricInformation) {
        const caloricInfo = healthProfile.caloricInformation;

        // Update calorie tracking per user
        caloricInfo.calories_consumed_per_day = (caloricInfo.calories_consumed_per_day || 0) + totalCalories / memberCount;
        caloricInfo.calories_consumed_per_week = (caloricInfo.calories_consumed_per_week || 0) + totalCalories / memberCount;
        caloricInfo.calories_consumed_per_month = (caloricInfo.calories_consumed_per_month || 0) + totalCalories / memberCount;

        // Update macronutrient consumption
        caloricInfo.consumed_carbs = (caloricInfo.consumed_carbs || 0) + totalCarbs / memberCount;
        caloricInfo.consumed_proteins = (caloricInfo.consumed_proteins || 0) + totalProteins / memberCount;
        caloricInfo.consumed_fats = (caloricInfo.consumed_fats || 0) + totalFats / memberCount;

        await caloricInfoRepository.save(caloricInfo);
      }
    }

    return { message: 'Meal selection recorded and caloric information updated successfully' };
  }
}
