import { Request, Response } from 'express';  
import { userService } from '../services/user.service';

// Register a new user
export const register = async (req: Request, res: Response):Promise<void> => {
  try {
    console.log(req.body)
    const { username, email, password } = req.body;  // Extract email and password from the request body
    const user = await userService.registerUser(username, email, password);  // Call the service to handle registration
    const userId: Number = user.id;
    res.status(201).json({ message: 'A code has been sent to your email. Please verify', userId });
  } catch (error) {
    res.status(400).json({ message:'error registering user' ,error });
  }
};

export const verifyCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  
  try {
    const verifiedUser = await userService.verifyUser(email, code);
    if (verifiedUser) {
      res.status(200).json({ message: 'User verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired code' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error during verification' });
  }
};

// Authenticate user (Login)
export const authenticate = async (req: Request, res: Response):Promise<void> => {
  try {
    console.log(req.body)
    const { email, password } = req.body;  // Extract email and password from the request body
    const token = await userService.authenticateUser(email, password);  // Call the service to handle login
    res.status(200).json({ token });
  } catch (error) {
    res.status(401).json({ message: 'Invalid email or password', error });
  }
};

export const updatePasswordHandler = async (req: Request, res: Response): Promise<void> => {
  const { newPassword, oldPassword } = req.body;
  const userId = res.locals.userId;  // Assuming the userId is attached from the JWT middleware

  try {
      await userService.updatePassword(userId,  newPassword, oldPassword);
      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      res.status(400).json({ message:'Error updating password' ,error });
  }
};

export const hasFamily = async (req: Request, res: Response): Promise<void> => {
  const userId = res.locals.userId;

  try {
    const response = await userService.hasFamily(userId);
    res.status(200).json({ response });
  }
  catch (error) {
    res.status(400).json({ message:'Error getting if the user has a family or not.' ,error });
  }
};

export const hasHealthProfile = async (req: Request, res: Response): Promise<void> => {
  const userId = res.locals.userId;

  try {
    const response = await userService.hasHealthProfile(userId);
    res.status(200).json({ response });
  }
  catch (error) {
    res.status(400).json({ message:'Error getting if the user has a health profile or not.' ,error });
  }
};
