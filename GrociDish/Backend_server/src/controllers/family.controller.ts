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
        console.log(323);
        
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
