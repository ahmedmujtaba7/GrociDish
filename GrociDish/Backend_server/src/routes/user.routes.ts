import { Router } from 'express';
import { register, authenticate, updatePasswordHandler, verifyCode, hasFamily } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// User Registration
router.post('/register', register);
router.post('/verifyUser',verifyCode);

// User Login
router.post('/authenticate', authenticate);

// Update User password
router.put('/update-password', authenticateToken, updatePasswordHandler)

router.get('/hasFamily', authenticateToken, hasFamily)

export default router;
