import { AppDataSource } from '../config/db.config';
import { RecipePreference } from '../entities/RecipePreference';
import { FamilyMember } from '../entities/FamilyMember';
import { Recipe } from '../entities/Recipe';
//import { Family } from '../entities/Family';

export class RecipePreferenceService {
  static async updatePreference(userId: number, recipeId: number, preference: 'LIKE' | 'DISLIKE' | 'REMOVE') {
    const preferenceRepository = AppDataSource.getRepository(RecipePreference);
    const familyMemberRepository = AppDataSource.getRepository(FamilyMember);
    const recipeRepository = AppDataSource.getRepository(Recipe);
    console.log(`Updating preference for recipe ID ${recipeId}`);
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

    // Check if a preference already exists
    let existingPreference = await preferenceRepository.findOne({
      where: { family: { id: familyId }, recipe: { id: recipeId } },
    });

    if (preference === 'REMOVE') {
        // **NEW FEATURE: Allow users to remove a LIKE/DISLIKE preference**
        if (existingPreference) {
            await preferenceRepository.remove(existingPreference);
            return { message: `Preference removed for recipe ID ${recipeId}` };
        } else {
            return { message: "No existing preference to remove." };
        }
    }

    if (existingPreference) {
      // **Update existing preference**
      existingPreference.preference = preference;
      await preferenceRepository.save(existingPreference);
    } else {
      // **Create new preference**
      const newPreference = preferenceRepository.create({
        family: { id: familyId },
        recipe: { id: recipeId },
        preference,
      });
      await preferenceRepository.save(newPreference);
    }
    console.log(`Recipe ${preference}d successfully`);
    return { message: `Recipe ${preference}d successfully` };
  }
}
