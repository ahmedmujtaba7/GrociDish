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


  async assignRole(ownerId: number, targetName: string, role: string) {
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const userRepo = AppDataSource.getRepository(User);
  
    const owner = await userRepo.findOne({
      where: { id: ownerId },
      relations: ['family'],
    });
  
    if (!owner || !owner.family) {
      throw new Error('Requesting user does not belong to a family');
    }
  
    const ownerMember = await familyMemberRepo.findOne({
      where: { family: { id: owner.family.id }, user: { id: ownerId }, is_owner: true },
    });
  
    if (!ownerMember) {
      throw new Error('Only family owners can assign roles');
    }
  
    const targetUser = await userRepo.findOne({
      where: { name: targetName, family: { id: owner.family.id } },
    });
  
    if (!targetUser) {
      throw new Error('Target user not found in your family');
    }
  
    const targetMember = await familyMemberRepo.findOne({
      where: { user: { id: targetUser.id }, family: { id: owner.family.id } },
    });
  
    if (!targetMember) {
      throw new Error('Target family member not found');
    }
  
    // Find the current role holder
    let currentRoleHolder: FamilyMember | null = null;
  
    if (role === 'grocery_generator') {
      currentRoleHolder = await familyMemberRepo.findOne({
        where: { family: { id: owner.family.id }, is_grocery_generator: true },
      });
      if (currentRoleHolder) currentRoleHolder.is_grocery_generator = false;
      targetMember.is_grocery_generator = true;
    } else if (role === 'recipe_selector') {
      currentRoleHolder = await familyMemberRepo.findOne({
        where: { family: { id: owner.family.id }, is_recipe_selector: true },
      });
      if (currentRoleHolder) currentRoleHolder.is_recipe_selector = false;
      targetMember.is_recipe_selector = true;
    } else {
      throw new Error(`Invalid role: ${role}`);
    }
  
    // Save updates to the database
    if (currentRoleHolder) await familyMemberRepo.save(currentRoleHolder);
    await familyMemberRepo.save(targetMember);
  
    return targetMember;
  }
}
