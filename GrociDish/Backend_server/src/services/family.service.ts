import { User } from "../entities/User";
import { Family } from "../entities/Family";
import { AppDataSource } from "../config/db.config";
import { generateFamilyCode } from "../utils/generateFamilyCode";

export const createFamily = async (userId: number) => {
    const userRepository = AppDataSource.getRepository(User);
    const familyRepository = AppDataSource.getRepository(Family);
  
    // Retrieve user and await the promise
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
  
    // Generate family code, increment membercount and create the new family instance
    const familyCode = generateFamilyCode();
    const newFamily = familyRepository.create({
      code: familyCode,
      owner: user,
      member_count: 1,
    });
    user.family=newFamily;
    console.log(user);

    // Save the family to the database
    await familyRepository.save(newFamily);
    await userRepository.save(user);
    return newFamily;
  };

  export const joinFamily = async (userId: number, familyCode: string) => {
    const userRepository = AppDataSource.getRepository(User);
    const familyRepository = AppDataSource.getRepository(Family);
  
    // Retrieve user and await the promise
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.family){
        throw new Error('user already in a family');
    }

    // Retrieve family and await the promise
    const family = await familyRepository.findOne({ where: { code: familyCode } });
    if (!family) {
    throw new Error('Family with this code does not exist.');
    }
  
    // make the user a member of the family and increment the family m
    user.family = family;
    family.member_count += 1;
  
    // Save the family to the database
    await familyRepository.save(family);
    await userRepository.save(user);
    return family;
  };

