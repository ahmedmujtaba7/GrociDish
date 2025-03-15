import { Family } from '../entities/Family';
import { FamilyMember } from '../entities/FamilyMember';
import { User } from '../entities/User';
import { AppDataSource } from "../config/db.config";
import { generateFamilyCode } from "../utils/generateFamilyCode";

export const createFamily = async (userId: number) => {
  const familyRepo = AppDataSource.getRepository(Family);
  const userRepo = AppDataSource.getRepository(User);
  
    // Retrieve user and await the promise
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
  
    // Generate family code, increment membercount and create the new family instance
    const code = generateFamilyCode();
    const family = familyRepo.create({ code, member_count: 1 });
    const savedFamily = await familyRepo.save(family);

    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const familyMember = familyMemberRepo.create({
      family: savedFamily,
      user,
      is_owner: true,
    });

    await familyMemberRepo.save(familyMember);

    user.family = savedFamily;
    await userRepo.save(user);

    return savedFamily;
  };

  export const joinFamily = async (userId: number, familyCode: string) => {
    console.log(424);
    
    const familyRepo = AppDataSource.getRepository(Family);
    const userRepo = AppDataSource.getRepository(User);
    const family = await familyRepo.findOneBy({ code: familyCode });
    console.log('familyCode:', familyCode);
    
    if (!family) throw new Error('Family not found');
    console.log("all good in joining family")

    if (family.member_count >= 10) throw new Error('Family is full');
    if (family.is_complete) throw new Error('Family is complete');
    const user = await userRepo.findOneBy({ id: userId });
    if (!user) throw new Error('User not found');
    console.log(user)
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const existingMember = await familyMemberRepo.findOneBy({ family: { id: family.id }, user: { id: userId } });
    if (existingMember) throw new Error('User already in family');

    const familyMember = familyMemberRepo.create({ family, user });
    await familyMemberRepo.save(familyMember);

    family.member_count += 1;
    await familyRepo.save(family);

    user.family = family;
    await userRepo.save(user);

    return family;
  };

  export const getFamilyRoles= async (userId: number) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['family'], // Ensure the `family` relationship is loaded
    });
    if (!user || !user.family) {
      throw new Error("the user is not in a family"); // No user or no family associated with the user
    }
    const familyId = user.family.id;
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const members = await familyMemberRepo.find({ where: { family: { id: familyId } }, relations: ['user'] });

    return members.map((member) => ({
      userId: member.user.id,
      name: member.user.name,
      is_owner: member.is_owner,
      is_grocery_generator: member.is_grocery_generator,
      is_recipe_selector: member.is_recipe_selector,
    }));
  };

  export const getFamilyCode = async (userId :number) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['family'], // Ensure the `family` relationship is loaded
    });
    if (!user || !user.family) {
      throw new Error("the user is not in a family"); // No user or no family associated with the user
    }
    const familyCode = user.family.code;

    return familyCode;
  }

  export const getFamilyNames = async (userId: number) => {
    const userRepo = AppDataSource.getRepository(User);
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
  
    // Fetch the user along with their family
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['family'], // Load the family relationship
    });
  
    if (!user || !user.family) {
      throw new Error('User does not belong to a family');
    }
  
    // Fetch all family members belonging to the user's family
    const familyMembers = await familyMemberRepo.find({
      where: { family: { id: user.family.id } }, // Filter by family ID
      relations: ['user'], // Load the user relationship to access names
    });
  
    // Transform the data to return only `id` and `name`
    return familyMembers.map((member) => ({
      id: member.user.id,
      name: member.user.name,
    }));
  };

  export const getFamilyDetails = async (userId: number) => {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['family'],
    });
  
    if (!user || !user.family) {
      throw new Error('User does not belong to a family');
    }
  
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
    const members = await familyMemberRepo.find({
      where: { family: { id: user.family.id } },
      relations: ['user'],
    });
  
    const familyDetails = {
      member_count: members.length,
      is_complete: user.family.is_complete,
      members: members.map((member) => ({
        id: member.user.id,
        name: member.user.name,
        is_owner: member.is_owner,
        is_grocery_generator: member.is_grocery_generator,
        is_recipe_selector: member.is_recipe_selector,
      })),
    };
  
    return familyDetails;
  };

  export const setFamilyCompletionStatus = async (userId: number, isComplete: boolean) => {
    const userRepo = AppDataSource.getRepository(User);
    const familyRepo = AppDataSource.getRepository(Family);
    const familyMemberRepo = AppDataSource.getRepository(FamilyMember);
  
    // Fetch the user's family
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ['family'],
    });
  
    if (!user || !user.family) {
      throw new Error('User does not belong to a family.');
    }
  
    // Verify the user is the owner of the family
    const ownerMember = await familyMemberRepo.findOne({
      where: { family: { id: user.family.id }, user: { id: userId }, is_owner: true },
    });
  
    if (!ownerMember) {
      throw new Error('Only the family owner can update the family status.');
    }
  
    // Update the `is_complete` attribute
    const family = await familyRepo.findOne({ where: { id: user.family.id } });
  
    if (!family) {
      throw new Error('Family not found.');
    }
  
    family.is_complete = isComplete;
    await familyRepo.save(family);
  
    return isComplete;
  };
