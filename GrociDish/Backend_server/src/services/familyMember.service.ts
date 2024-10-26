// src/services/familyService.ts
import { AppDataSource } from '../config/db.config';
import { Family } from '../entities/Family';
import { FamilyMember } from '../entities/FamilyMember';

interface FamilyMemberData {
  family_id: number;
  name: string;
  age: number;
  weight?: number;
  height?: number;
  activity_level?: string;
  diseases?: string[];
  groceryGenerator: boolean;
  recipeGenerator: boolean;
}

// Add a Family Member
export const addFamilyMember = async (data: FamilyMemberData) => {
  const familyRepository = AppDataSource.getRepository(Family);
  const familyMemberRepository = AppDataSource.getRepository(FamilyMember);

  // Find the family to associate with
  const family = await familyRepository.findOneBy({ family_id: data.family_id });
  if (!family) throw new Error('Family not found');

  // Create and save the new family member
  const newMember = familyMemberRepository.create({
    ...data,
    family,
  });
  await familyMemberRepository.save(newMember);

  // Increment the family member count
  family.member_count += 1;
  await familyRepository.save(family);

  return newMember;
};

// Update Family Member
export const updateFamilyMember = async (memberId: number, updates: Partial<FamilyMemberData>) => {
  const familyMemberRepository = AppDataSource.getRepository(FamilyMember);

  // Find the family member and update fields
  const member = await familyMemberRepository.findOneBy({ member_id: memberId });
  if (!member) throw new Error('Family member not found');

  Object.assign(member, updates);
  return await familyMemberRepository.save(member);
};

// Delete a Family Member
export const deleteFamilyMember = async (memberId: number) => {
  const familyRepository = AppDataSource.getRepository(Family);
  const familyMemberRepository = AppDataSource.getRepository(FamilyMember);

  // Find the member and associated family
  const member = await familyMemberRepository.findOneBy({ member_id: memberId });
  if (!member) throw new Error('Family member not found');
  
  const family = await familyRepository.findOneBy({ family_id: member.family.family_id });
  if (!family) throw new Error('Associated family not found');

  // Delete the family member and update member count
  await familyMemberRepository.remove(member);
  family.member_count -= 1;
  await familyRepository.save(family);
};
