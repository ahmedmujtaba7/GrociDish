import { AppDataSource } from '../config/db.config';
import { User } from '../entities/User';
import { HealthProfile } from '../entities/HealthProfile';
import { CaloricInformation } from '../entities/CaloricInformation';

interface HealthProfilePayload {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  activity_level?: string;
  diseases?: string[];
}

/**
 * Service to create a new health profile for a user.
 */
export const createHealthProfileService = async (
  userId: number,
  payload: Required<HealthProfilePayload>
): Promise<HealthProfile> => {
  const userRepository = AppDataSource.getRepository(User);
  const healthProfileRepository = AppDataSource.getRepository(HealthProfile);
  const caloricInformationRepository = AppDataSource.getRepository(CaloricInformation);

  // Find the user
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['healthProfile', 'healthProfile.caloricInformation'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (user.healthProfile) {
    throw new Error('Health profile already exists. Use the update service instead.');
  }

  // Calculate BEE and BMI
  const bee = calculateBEE(payload);
  const bmi = calculateBMI(payload);
  const requiredCalories = calculateRequiredCalories(bee, payload.activity_level);

  const fats = calculateFats(requiredCalories); //required fats
  const carbs= calculateCarbs(requiredCalories); //required carbs
  const proteins = calculateProteins(requiredCalories); //required proteins
  // Create caloric information
  const caloricInformation = caloricInformationRepository.create({
    required_calories: requiredCalories,
    bmi: bmi,
    required_carbs: carbs,
    required_proteins: proteins,
    required_fats: fats,
  });
  await caloricInformationRepository.save(caloricInformation);

  // Create health profile
  const newProfile = healthProfileRepository.create({
    ...payload,
    user,
    caloricInformation,
  });
  await healthProfileRepository.save(newProfile);

  user.healthProfile = newProfile;
  await userRepository.save(user);

  return newProfile;
};

/**
 * Service to update an existing health profile for a user.
 */
export const updateHealthProfileService = async (
  userId: number,
  payload: Partial<HealthProfilePayload>
): Promise<HealthProfile> => {
  console.log("updation is going on 1");
  const userRepository = AppDataSource.getRepository(User);
  const healthProfileRepository = AppDataSource.getRepository(HealthProfile);
  const caloricInformationRepository = AppDataSource.getRepository(CaloricInformation);
  console.log(payload)
  // Find the user
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['healthProfile', 'healthProfile.caloricInformation'],
  });
  console.log("updation is going on 2");
  
  if (!user || !user.healthProfile) {
    throw new Error('Health profile not found for this user.');
  }
  if (typeof payload.diseases === 'string') {
    payload.diseases = [payload.diseases];
  }
  const existingProfile = user.healthProfile;
  existingProfile.age = payload.age ?? existingProfile.age;
  existingProfile.weight = payload.weight ?? existingProfile.weight;
  existingProfile.height = payload.height ?? existingProfile.height;
  existingProfile.diseases = payload.diseases ?? existingProfile.diseases;
  existingProfile.activity_level= payload.activity_level ?? existingProfile.activity_level;

  // Calculate BEE and BMI if required fields are updated
  let bee = existingProfile.caloricInformation?.required_calories || 0;
  let bmi = existingProfile.caloricInformation?.bmi || 0;

  bee = calculateBEE(existingProfile);
  bmi = calculateBMI(existingProfile);

  console.log("updation is going on 3");
    const requiredCalories = calculateRequiredCalories(bee, existingProfile.activity_level);
    const fats = calculateFats(requiredCalories); //required fats
    const carbs= calculateCarbs(requiredCalories); //required carbs
    const proteins = calculateProteins(requiredCalories); //required proteins
    // Update caloric information
    if (existingProfile.caloricInformation) {
      existingProfile.caloricInformation.required_calories = requiredCalories;
      existingProfile.caloricInformation.bmi = bmi;
      existingProfile.caloricInformation.required_carbs = carbs;
      existingProfile.caloricInformation.required_fats = fats;
      existingProfile.caloricInformation.required_proteins = proteins;
      await caloricInformationRepository.save(existingProfile.caloricInformation);
    } else {
      const newCaloricInformation = caloricInformationRepository.create({
        required_calories: requiredCalories,
        bmi: bmi,
      });
      await caloricInformationRepository.save(newCaloricInformation);
      existingProfile.caloricInformation = newCaloricInformation;
    }
  console.log("updation is going on 4");
  // Update the health profile
  Object.assign(existingProfile, payload);
  return await healthProfileRepository.save(existingProfile);
};

/**
 * Helper function to calculate BEE (Basal Energy Expenditure).
 */
const calculateBEE = (payload: Required<HealthProfilePayload>): number => {
  const { gender, weight, height, age } = payload;
  if (!gender || !weight || !height || !age) {
    throw new Error('Missing required fields for BEE calculation.');
  }
  return gender === 'male'
    ? 66.5 + 13.8 * weight + 5.0 * height - 6.8 * age
    : 655.1 + 9.6 * weight + 1.9 * height - 4.7 * age;
};

/**
 * Helper function to calculate BMI (Body Mass Index).
 */
const calculateBMI = (payload: Required<HealthProfilePayload>): number => {
  const { weight, height } = payload;
  if (!weight || !height) {
    throw new Error('Missing required fields for BMI calculation.');
  }
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

const calculateFats = ( tee: number): number => {
  const fats : number= tee * 0.3;
  return fats/4;
}

const calculateCarbs = ( tee: number): number => {
  const carbs : number= tee * 0.5;
  return carbs/4;
}

const calculateProteins = ( tee: number): number => {
  const proteins : number= tee * 0.2;
  return proteins/9;
}

/**
 * Helper function to calculate required calories based on activity level.
 */
const calculateRequiredCalories = (bee: number, activity_level?: string): number => {
  switch (activity_level) {
    case 'sedentary':
      return bee * 1.2;
    case 'light':
      return bee * 1.375;
    case 'moderate':
      return bee * 1.55;
    case 'active':
      return bee * 1.725;
    default:
      throw new Error('Invalid activity level.');
  }
};



export const getHealthProfileService = async (userId: number) => {
  const userRepository = AppDataSource.getRepository(User);

  // Find the user along with the health profile and caloric information
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['healthProfile', 'healthProfile.caloricInformation'],
  });

  if (!user || !user.healthProfile) {
    throw new Error("user or health profile does not exist")
  }

  return {
    age: user.healthProfile.age,
    gender: user.healthProfile.gender,
    weight: user.healthProfile.weight,
    height: user.healthProfile.height,
    activity_level: user.healthProfile.activity_level,
    diseases: user.healthProfile.diseases,
  };
};


