import { AppDataSource } from '../config/db.config';
import { User } from '../entities/User';
import { HealthProfile } from '../entities/HealthProfile';

interface HealthProfilePayload {
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  activity_level?: string;
  diseases?: string[];
  calories_tracked?: number;
}

export const createOrUpdateHealthProfileService = async (
  userId: number,
  payload: HealthProfilePayload
): Promise<HealthProfile> => {
  const userRepository = AppDataSource.getRepository(User);
  const healthProfileRepository = AppDataSource.getRepository(HealthProfile);

  // Find the user
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['healthProfile'], // Include the health profile in the query
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.healthProfile) {
    // Create a new health profile
    const newProfile = healthProfileRepository.create({ ...payload, user });
    await healthProfileRepository.save(newProfile);
    return newProfile;
  } else {
    // Update the existing health profile
    const updatedProfile = { ...user.healthProfile, ...payload };
    return await healthProfileRepository.save(updatedProfile);
  }
};
