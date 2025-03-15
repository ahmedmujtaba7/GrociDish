import { Router } from 'express';
import { register, authenticate, updatePasswordHandler, verifyCode, hasFamily, hasHealthProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// User Registration
router.post('/register', register);

// verify the code sent to the email
router.post('/verifyUser',verifyCode);

// User Login
router.post('/authenticate', authenticate);

// Update User password
router.put('/update-password', authenticateToken, updatePasswordHandler);
// check whether a user has a family or not
router.get('/hasFamily', authenticateToken, hasFamily)

// check whether a user has a health profile or not
router.get('/hasHealthProfile', authenticateToken, hasHealthProfile)

export default router;
