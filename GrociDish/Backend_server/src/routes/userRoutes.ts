import { Router } from 'express';
import { createUser, authenticateUser } from '../controllers/userController';

const router = Router();

// Route for creating a new user
router.post('/users', createUser);

// Route for user authentication
router.post('/users/authenticate', authenticateUser);

export default router;
