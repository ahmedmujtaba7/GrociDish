import { Router } from "express";
import {createFamily, joinFamily} from '../controllers/family.controller'
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post('/createFamily', authenticateToken, createFamily);
router.post('/joinFamily', authenticateToken, joinFamily);

export default router;