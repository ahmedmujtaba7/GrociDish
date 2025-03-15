//jwt.ts
import jwt from 'jsonwebtoken';

// Function to generate JWT
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '4h' });
};



// Function to verify JWT
export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};