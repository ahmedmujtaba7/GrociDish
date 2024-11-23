import { FamilyMember } from '../entities/FamilyMember';
import { AppDataSource } from '../config/db.config';
import { User } from '../entities/User';
export class RoleService {
  async getUserRole(userId: number) {
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);

    const familyMember = await familyMemberRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'family'],
    });

    if (!familyMember) throw new Error('Family member not found');

    return {
      is_owner: familyMember.is_owner,
      is_grocery_generator: familyMember.is_grocery_generator,
      is_recipe_selector: familyMember.is_recipe_selector,
    };
  }

  async assignRole(userId: number, role: string) {
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const userRepo= AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
        where: { id: userId },
        relations: ['family'], // Ensure the `family` relationship is loaded
    });
    
    if (!user || !user.family) {
        throw new Error("user does not have a family"); // No user or no family associated with the user
    }

    const familyId = user.family.id;;
    
    const familyMember = await familyMemberRepo.findOneBy({ family: { id: familyId }, user: { id: userId } });
    if (!familyMember) throw new Error('Family member not found');

    if (role === 'owner') familyMember.is_owner = true;
    else if (role === 'grocery_generator') familyMember.is_grocery_generator = true;
    else if (role === 'recipe_selector') familyMember.is_recipe_selector = true;
    else throw new Error('Invalid role');

    return await familyMemberRepo.save(familyMember);
  }
}
