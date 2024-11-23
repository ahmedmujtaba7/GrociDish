import express from 'express';
import { assignRole, getUserRole } from '../controllers/role.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
const router = express.Router();

// Assign roles to family members
router.post('/assign', authenticateToken, assignRole);
router.get('/getRole', authenticateToken, getUserRole);


export default router;