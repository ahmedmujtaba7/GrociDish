import { Request, Response } from 'express';
import { createOrUpdateHealthProfileService } from '../services/healthProfile.service';
export const createOrUpdateHealthProfile = async (req: Request, res: Response) => {
  const { userId } = res.locals.userId;
  const { age, gender, weight, height, activity_level, diseases, calories_tracked } = req.body;

  try {
    const updatedProfile = await createOrUpdateHealthProfileService(Number(userId), {
      age,
      gender,
      weight,
      height,
      activity_level,
      diseases,
      calories_tracked,
    });

    res.status(200).json({
      message: 'Health profile processed successfully.',
      healthProfile: updatedProfile,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing health profile.", error });
  }
};
