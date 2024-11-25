import { Router } from "express";
import {createFamily, joinFamily, getFamilyRoles} from '../controllers/family.controller'
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post('/createFamily', authenticateToken, createFamily);
router.post('/joinFamily', authenticateToken, joinFamily);
router.post('/getAllRoles',authenticateToken, getFamilyRoles)
export default router;