import { Request, Response } from "express";
import * as familyService from '../services/family.service';


export const createFamily = async ( req: Request, res: Response ) => {
    const userId = res.locals.userId;
    try {
        const newFamily = await familyService.createFamily(userId);
        res.status(200).json({ message : "A family has been created successfully", family_Id : newFamily.id, code: newFamily.code})
    }
    catch (error) {
        res.status(501).json({ message : "error creating family" , error});
    }
};

export const joinFamily = async (req: Request, res: Response) => {
    const Code = req.body;
    const code = Code.code; // dereferencing code object
    const userId = res.locals.userId;
    try {        
        const newFamily = await familyService.joinFamily(userId, code);
        res.status(200).json({ message : "A family has been joined successfully", family_Id : newFamily.id})
    }
    catch (error) {
        res.status(501).json({ message : "Error joining family" , error});
    }
};

export const getFamilyRoles = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId;
      const roles = await familyService.getFamilyRoles(userId);
      res.status(200).json({ roles });
    } catch (error) {
      res.status(400).json({ message : "Error getting family roles", error });
    }
};
export const getFamilyCode= async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const code = await familyService.getFamilyCode(userId);
        res.status(200).json({ code });
    } catch (error) {
        res.status(400).json({ message: "Error getting family code", error})
    }
};

export const getFamilyNames = async (req: Request, res: Response) => {
    try {
        const userId = res.locals.userId;
        const members = await familyService.getFamilyNames(userId);
        res.status(200).json({members});
    } catch (error) {
        res.status(400).json({ message: "Error getting family names", error})
    }
};

export const getFamilyDetails = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId; // Assuming userId is stored in res.locals from authentication middleware
      const familyDetails = await familyService.getFamilyDetails(userId);
      res.status(200).json(familyDetails);
    } catch (error) {
      console.error('Error fetching family details:', error);
      res.status(400).json({ message: 'Error fetching family details', error });
    }
};

export const setFamilyCompletionStatus = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.userId; // User ID from authentication middleware
      const { isComplete } = req.body; // Boolean value from request body
  
      if (typeof isComplete !== 'boolean') {
        res.status(400).json({ message: 'Invalid isComplete value. Must be a boolean.' });
      }
  
      const result = await familyService.setFamilyCompletionStatus(userId, isComplete);
      res.status(200).json({ result });
    } catch (error) {
      console.error('Error setting family completion status:', error);
      res.status(400).json({ message: 'Error setting family completion status', error });
    }
  };
