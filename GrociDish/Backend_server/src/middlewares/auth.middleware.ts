import { Request, Response, NextFunction } from 'express';
import {verifyToken} from '../utils/jwt'

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token: any = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = verifyToken(token);
        res.locals.userId = (decoded as any).userId; // Attach userId to res.locals
        next();
    } catch (err) {
        res.status(403).json({ message: 'Forbidden' });
    }
};

