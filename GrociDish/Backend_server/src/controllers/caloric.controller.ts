import { Request, Response } from "express";
import { getCaloricInfo } from "../services/caloric.service";

export const getCaloricInfoController = async (req:Request, res:Response) => {
    const userId= res.locals.userId;
    try {
        const caloricData = await getCaloricInfo(userId);
        res.status(200).json({ caloricData })
    } catch (error) {
        res.status(400).json({ message : "Error getting caloric information", error });
    }
}