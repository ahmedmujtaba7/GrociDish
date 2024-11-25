import { Router } from 'express';
import { createOrUpdateHealthProfile } from '../controllers/healthProfile.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// POST/PUT endpoint to create or update health profile
router.post('/processHealthProfile', authenticateToken,createOrUpdateHealthProfile);

export default router;
