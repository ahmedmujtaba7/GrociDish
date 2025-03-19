import { Request, Response } from "express";
import * as groceryService from '../services/grocery.service';

export const createGroceryList = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const { budget, diseases } = req.body;
    try {
        const newGroceryList = await groceryService.createGroceryList(userId, budget, diseases);
        res.status(200).json({ message: "A grocery list has been created successfully", groceryListId: newGroceryList.id })
    }
    catch (error) {
        res.status(501).json({ message: "Error creating grocery list", error });
    }
};

export const getGroceryList = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    try {
        const groceryList = await groceryService.getGroceryList(userId);
        res.status(200).json({ message: "Grocery list retrieved successfully", groceryList });
    } catch (error) {
        res.status(501).json({ message: "Error retrieving grocery list", error });
    }
}

export const updateGroceryList = async (req: Request, res: Response) => {
    const userId = res.locals.userId;
    const { groceryListId, groceryItems } = req.body;
    try {
        await groceryService.updateGroceryList(userId, groceryListId, groceryItems);
        res.status(200).json({ message: "Grocery list updated successfully" });
    } catch (error) {
        res.status(501).json({ message: "Error updating grocery list", error });
    }
}
