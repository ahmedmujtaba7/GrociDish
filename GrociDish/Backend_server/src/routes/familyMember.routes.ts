// src/routes/familyRoutes.ts
import { Router } from 'express';
import { addFamilyMember, updateFamilyMember, deleteFamilyMember } from '../controllers/familyMember.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/add-member', authenticateToken, addFamilyMember);
router.put('/update-member/:id', authenticateToken, updateFamilyMember);
router.delete('/delete-member/:id', authenticateToken, deleteFamilyMember);

export default router;
