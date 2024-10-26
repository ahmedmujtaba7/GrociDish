// src/controllers/familyController.ts
import { Request, Response } from 'express';
import * as familyService from '../services/familyMember.service';

// Add a Family Member
export const addFamilyMember = async (req: Request, res: Response) => {
  const { family_id, name, age, weight, height, activity_level, diseases, groceryGenerator, recipeGenerator } = req.body;
  try {
    const newMember = await familyService.addFamilyMember({
      family_id,
      name,
      age,
      weight,
      height,
      activity_level,
      diseases,
      groceryGenerator,
      recipeGenerator,
    });
    res.status(201).json({ message: 'Family member added successfully', member: newMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding family member', error });
  }
};

// Update Family Member
export const updateFamilyMember = async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id);
  const { age, weight, height, activity_level, diseases } = req.body;

  try {
    const updatedMember = await familyService.updateFamilyMember(memberId, {
      age, weight, height, activity_level, diseases
    });
    res.status(200).json({ message: 'Family member updated successfully', member: updatedMember });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating family member', error });
  }
};

// Delete a Family Member
export const deleteFamilyMember = async (req: Request, res: Response) => {
  const memberId = parseInt(req.params.id);

  try {
    await familyService.deleteFamilyMember(memberId);
    res.status(200).json({ message: 'Family member deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting family member', error });
  }
};
