import { Request, Response } from "express";
import { GroceryListService } from "../services/grocery.service";

export class GroceryListController {
  // **Generate and Store Grocery List**
  static async generateGroceryList(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      const {budget} = req.body;
      if (!userId || !budget) {
        res.status(400).json({ success: false, message: "userId and budget are required" });
      }

      const result = await GroceryListService.generateGroceryList(userId, budget);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      console.error("Error generating grocery list:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }

  // **Get Grocery List by User ID**
  static async getGroceryListByUser(req: Request, res: Response) {
    try {
      const userId = res.locals.userId;
      if (!userId) res.status(400).json({ success: false, message: "Invalid user ID" });

      const result = await GroceryListService.getGroceryListByUser(userId);
      res.status(result.success ? 200 : 404).json(result);
    } catch (error) {
      console.error("Error fetching grocery list:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
}
