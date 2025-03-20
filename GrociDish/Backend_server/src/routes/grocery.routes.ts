import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { GroceryListController } from "../controllers/grocery.controller";
const router = Router();

router.post('/createGroceryList', authenticateToken, GroceryListController.generateGroceryList);
router.post('/getGroceryList', authenticateToken, GroceryListController.getGroceryListByUser);
//router.put('/updateGroceryList', authenticateToken, GroceryListController.updateGroceryList);
export default router;