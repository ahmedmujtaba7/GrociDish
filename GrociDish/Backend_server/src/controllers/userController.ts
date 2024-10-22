import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/userService';

// POST /users – Create a new user account
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Check if the email already exists
        const existingUser = await UserService.findUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await UserService.CreateUser(email, hashedPassword);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                userId: newUser.id,
                email: newUser.email,
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

// POST /users/authenticate – Authenticate and log in a user
export const authenticateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await UserService.findUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                userId: user.id,
                email: user.email,
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Error authenticating user', error: error.message });
    }
};
