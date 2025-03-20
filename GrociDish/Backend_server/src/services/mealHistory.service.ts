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
        throw new Error(`User ${userId} does not belong to any family.`);
    }

    const familyId = familyMember.family.id;

    // Check if the recipe exists
    const recipe = await recipeRepository.findOne({ where: { id: recipeId } });
    if (!recipe) {
        throw new Error(`Recipe with ID ${recipeId} not found.`);
    }

    // Ensure mealType consistency
    if (['LUNCH', 'DINNER', 'LUNCH/DINNER'].includes(mealType)) {
        mealType = 'LUNCH/DINNER';
    }

    // Get family size
    const familyMembers = await familyMemberRepository.find({
        where: { family: { id: familyId } },
        relations: ['user'],
    });
    const memberCount = familyMembers.length;

    // Calculate total calories
    const totalCalories = recipe.caloriesPerServing * memberCount;
    const totalCarbs = recipe.carbohydrates * memberCount;
    const totalProteins = recipe.proteins * memberCount;
    const totalFats = recipe.fats * memberCount;

    console.log(`total calories: ${totalCalories}, total carbs: ${totalCarbs}, total proteins: ${totalProteins}, total fats: ${totalFats}`);
    // Store meal selection in history
    const mealRecord = mealHistoryRepository.create({
        family: { id: familyId },
        recipe: { id: recipeId },
        mealType,
        selected: true,
    });

    console.log(`Member Count: ${memberCount}`);
    console.log(`Calories per Serving: ${recipe.caloriesPerServing}`);
    console.log(`Total Calories: ${totalCalories}`);
    console.log(`Calories per Member: ${totalCalories / memberCount}`);

    await mealHistoryRepository.save(mealRecord);

    // Update caloric information for each family member
    for (const member of familyMembers) {
        const healthProfile = await healthProfileRepository.findOne({
            where: { user: { id: member.user.id } },
            relations: ['caloricInformation'],
        });

        if (healthProfile && healthProfile.caloricInformation) {
            const caloricInfo = healthProfile.caloricInformation;
            caloricInfo.calories_consumed_per_day = Number(caloricInfo.calories_consumed_per_day ?? 0) + (totalCalories / memberCount);
            caloricInfo.calories_consumed_per_week = Number(caloricInfo.calories_consumed_per_week ?? 0) + (totalCalories / memberCount);
            caloricInfo.calories_consumed_per_month = Number(caloricInfo.calories_consumed_per_month ?? 0) + (totalCalories / memberCount);



            caloricInfo.consumed_carbs = Number(caloricInfo.consumed_carbs || 0) + (totalCarbs / memberCount);
            caloricInfo.consumed_proteins = Number(caloricInfo.consumed_proteins || 0) + (totalProteins / memberCount);
            caloricInfo.consumed_fats = Number(caloricInfo.consumed_fats || 0) + (totalFats / memberCount);
            console.log((caloricInfo.calories_consumed_per_day || 0) + (totalCalories / memberCount))
            console.log(`calories consumed per day: ${caloricInfo.calories_consumed_per_day}, calories consumed per week: ${caloricInfo.calories_consumed_per_week}, calories consumed per month: ${caloricInfo.calories_consumed_per_month}`);

            await caloricInfoRepository.save(caloricInfo);
        }
    }

    return { message: `Meal recorded for recipe ${recipeId} as ${mealType}` };
}
}
