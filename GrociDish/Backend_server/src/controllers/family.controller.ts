import { Request, Response } from "express";
import * as familyService from '../services/family.service';


export const createFamily = async ( req: Request, res: Response ) => {
    const userId = res.locals.userId;
    try {
        const newFamily = await familyService.createFamily(userId);
        res.status(200).json({ message : "A family has been created successfully", family_Id : newFamily.family_id, code: newFamily.code})
    }
    catch (error) {
        res.status(501).json({ message : "error creating family" , error});
    }
};

export const joinFamily = async (req: Request, res: Response) => {
    const code = req.body;
    const userId = res.locals.userId;
    try {
        const newFamily = await familyService.joinFamily(userId, code);
        res.status(200).json({ message : "A family has been joined successfully", family_Id : newFamily.family_id})
    }
    catch (error) {
        res.status(501).json({ message : "Error joining family" , error});
    }
};
