import { Router } from 'express';
import { updateHealthProfile,createHealthProfile, getHealthProfileController } from '../controllers/healthProfile.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// POST/PUT endpoint to create or update health profile
router.post('/updateHealthProfile', authenticateToken, updateHealthProfile);
router.post('/createHealthProfile', authenticateToken, createHealthProfile);
router.post('/getHealthProfile', authenticateToken, getHealthProfileController )
export default router;
