import { Request, Response } from 'express';
import { createHealthProfileService, getHealthProfileService, updateHealthProfileService } from '../services/healthProfile.service';

export const createHealthProfile = async (req: Request, res: Response) => {
  const userId  = res.locals.userId;
  const { age, gender, weight, height, activity_level, diseases } = req.body;

  try {
    const updatedProfile = await createHealthProfileService(userId, {
      age,
      gender,
      weight,
      height,
      activity_level,
      diseases,
    });

    res.status(200).json({
      message: 'Health profile created successfully.',
      healthProfile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating health profile.", error });
  }
};

export const updateHealthProfile = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const { age, gender, weight, height, activity_level, diseases } = req.body;

  try {
    const updatedProfile = await updateHealthProfileService(userId, {
      age,
      gender,
      weight,
      height,
      activity_level,
      diseases,
    });

    res.status(200).json({
      message: 'Health profile updated successfully.',
      healthProfile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating health profile.',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getHealthProfileController = async (req: Request, res: Response) => {
  try {
    const userId = res.locals.userId;
    const healthProfile = await getHealthProfileService(userId);

    if (!healthProfile) {
      res.status(404).json({ message: 'Health profile not found for the user' });
    }

    res.status(200).json({ healthProfile });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving health profile', error: error.message });
  }
}
