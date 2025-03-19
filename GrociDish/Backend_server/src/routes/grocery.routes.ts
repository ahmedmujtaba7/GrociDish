import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { createGroceryList, getGroceryList, updateGroceryList } from '../controllers/grocery.controller'
const router = Router();

router.post('/createGroceryList', authenticateToken, createGroceryList);
router.post('/getGroceryList', authenticateToken, getGroceryList);
router.put('/updateGroceryList', authenticateToken, updateGroceryList);
export default router;