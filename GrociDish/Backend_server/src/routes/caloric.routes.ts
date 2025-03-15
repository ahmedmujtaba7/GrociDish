import { Router } from "express";
import { getCaloricInfoController } from "../controllers/caloric.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post('/getCaloricInfo', authenticateToken, getCaloricInfoController);

export default router;