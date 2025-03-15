import { Router } from "express";
import {createFamily, joinFamily, getFamilyRoles, getFamilyCode, getFamilyNames, getFamilyDetails, setFamilyCompletionStatus} from '../controllers/family.controller'
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post('/createFamily', authenticateToken, createFamily);
router.post('/joinFamily', authenticateToken, joinFamily);
router.post('/getAllRoles',authenticateToken, getFamilyRoles);
router.post('/getFamilyCode', authenticateToken, getFamilyCode);
router.get('/getFamilyNames', authenticateToken, getFamilyNames);
router.get('/getFamilyDetails', authenticateToken, getFamilyDetails);
router.put('/family-completion-status', authenticateToken, setFamilyCompletionStatus);


export default router;