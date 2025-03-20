import { FamilyMember } from '../entities/FamilyMember';
import { HealthProfile } from '../entities/HealthProfile';
//import { CaloricInformation } from '../entities/CaloricInformation';
import { AppDataSource } from '../config/db.config';
import { Recipe } from '../entities/Recipe';
import { RecipePreference } from '../entities/RecipePreference';
import { MealHistory } from '../entities/MealHistory';

export class RecipeRecommendationService {
  static async recommendRecipes(userId: number) {
    const recipeRepository = AppDataSource.getRepository(Recipe);
    const preferenceRepository = AppDataSource.getRepository(RecipePreference);
    const mealHistoryRepository = AppDataSource.getRepository(MealHistory);
    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const healthProfileRepository = AppDataSource.getRepository(HealthProfile);

    console.log("Starting recipe recommendation...");

    // Find the family of the user
    const userFamilyMember = await familyMemberRepository.findOne({
        where: { user: { id: userId } },
        relations: ['family'],
    });

    if (!userFamilyMember || !userFamilyMember.family) {
        console.error("User does not belong to any family.");
        return { success: false, message: "User does not belong to any family." };
    }

    const familyId = userFamilyMember.family.id;
    console.log("User belongs to family ID:", familyId);

    // Fetch all family members
    const familyMembers = await familyMemberRepository.find({
        where: { family: { id: familyId } },
        relations: ['user'],
    });

    console.log("Total family members:", familyMembers.length);

    const memberCount = familyMembers.length;
    let totalRequiredCalories = 0;
    let diseasesSet = new Set<string>();

    for (const member of familyMembers) {
        const healthProfile = await healthProfileRepository.findOne({
            where: { user: { id: member.user.id } },
            relations: ['caloricInformation'],
        });

        if (healthProfile) {
            totalRequiredCalories += Number(healthProfile.caloricInformation?.required_calories) || 0;
            healthProfile.diseases.forEach((disease) => diseasesSet.add(disease));
        }
    }

    console.log("Total required calories:", totalRequiredCalories);
    console.log("Detected diseases:", Array.from(diseasesSet));

    // Fetch liked and disliked recipes
    const likedRecipes = await preferenceRepository.find({
        where: { family: { id: familyId }, preference: 'LIKE' },
        relations: ['recipe'],
    });

    const dislikedRecipes = await preferenceRepository.find({
        where: { family: { id: familyId }, preference: 'DISLIKE' },
        relations: ['recipe'],
    });

    const recentMeals = await mealHistoryRepository.find({
        where: { family: { id: familyId } },
        relations: ['recipe'],
        order: { created_at: 'DESC' },
        take: 9, // Avoid last 9 recently selected meals
    });

    let excludedRecipeIds = [
        ...dislikedRecipes.map((p) => p.recipe.id),
        ...recentMeals.map((m) => m.recipe.id),
    ];

    console.log("Excluded Recipes: ", excludedRecipeIds);

    const balancedMeal: any = {
        BREAKFAST: [],
        LUNCH: [],
        DINNER: [],
        DISEASE_SPECIFIC: []
    };

    const calorieDistribution = (totalRequiredCalories / 3) - 200 + Math.random() * 400; // ±200 kcal range
    console.log("Calorie Distribution per meal:", calorieDistribution);

    // Fetch Recipes for Each Meal Type (Handling "LUNCH/DINNER" for both lunch and dinner)
    const mealTypes = {
        BREAKFAST: ['BREAKFAST'],
        LUNCH: ['LUNCH/DINNER'],
        DINNER: ['LUNCH/DINNER'],
    };

    for (const [mealType, dbCategories] of Object.entries(mealTypes)) {
        console.log(`Fetching recipes for ${mealType}...`);

        let recipes = await recipeRepository
            .createQueryBuilder('recipe')
            .where('recipe.category IN (:...dbCategories)', { dbCategories })
            .orderBy('RANDOM()')
            .take(20)
            .getMany();

        console.log(`${mealType} recipes found:`, recipes.length);

        if (recipes.length === 0) {
            console.error(`No ${mealType} recipes found in database!`);
        }

        let selectedRecipes = recipes.slice(0, 1);
        balancedMeal[mealType] = selectedRecipes;
    }

    // Recommend separate recipes for diseases (1 serving each)
    for (const disease of diseasesSet) {
        console.log(`Fetching disease-specific recipes for ${disease}...`);

        let diseaseRecipes = await recipeRepository
            .createQueryBuilder('recipe')
            .where('recipe.disease = :disease', { disease })
            .andWhere('recipe.category IN (:...categories)', { categories: ['BREAKFAST', 'LUNCH/DINNER'] })
            .orderBy('RANDOM()')
            .take(3)
            .getMany();

        console.log(`Disease-specific recipes found:`, diseaseRecipes.length);

        while (diseaseRecipes.length < 3) {
            const extraDiseaseRecipes = await recipeRepository
                .createQueryBuilder('recipe')
                .where('recipe.category IN (:...categories)', { categories: ['BREAKFAST', 'LUNCH/DINNER'] })
                .orderBy('RANDOM()')
                .take(3 - diseaseRecipes.length)
                .getMany();

            diseaseRecipes.push(...extraDiseaseRecipes);
        }

        balancedMeal.DISEASE_SPECIFIC = diseaseRecipes;
    }

    console.log("Final recommended meals:", JSON.stringify(balancedMeal, null, 2));

    return { success: true, data: balancedMeal };
 }

  static async getRecipes(
    page: number,
    limit: number,
    category?: string,
    ingredientType?: string,
    foodType?: string,
    disease?: string
  ) {
    const recipeRepository = AppDataSource.getRepository(Recipe);
  
    const query = recipeRepository.createQueryBuilder('recipe');
  
    if (category) {
      query.andWhere('recipe.category = :category', { category });
    }
  
    if (ingredientType) {
      query.andWhere('recipe.ingredientType = :ingredientType', { ingredientType });
    }
  
    if (foodType) {
      query.andWhere('recipe.foodType = :foodType', { foodType });
    }
  
    if (disease && disease !== 'None') {
      query.andWhere('recipe.disease = :disease', { disease });
    }
  
    const [recipes, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
  
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        ingredients: recipe.ingredients, // JSONB field
        directions: recipe.directions,
        category: recipe.category,
        ingredientType: recipe.ingredientType,
        foodType: recipe.foodType,
        caloriesPerServing: recipe.caloriesPerServing,
        carbohydrates: recipe.carbohydrates,
        proteins: recipe.proteins,
        fats: recipe.fats,
        picture: recipe.picture,
        disease: recipe.disease,
        created_at: recipe.created_at,
        updated_at: recipe.updated_at,
      })),
    };
  }  
}
