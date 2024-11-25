import { User } from '../entities/User';
//import { Family } from '../entities/Family';
import { AppDataSource } from '../config/db.config';
import { hashPassword, comparePassword } from '../utils/hashPassword';
import { generateToken } from '../utils/jwt';
import { generateVerificationCode } from '../utils/generateOTP';
import { sendVerificationEmail } from './email.service';

// Function to register a new user
export const userService = {
  registerUser: async ( username: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = await AppDataSource.getRepository(User).findOneBy({ email });
    if (existingUser) throw new Error('User already exists');
    // Hash the password using bcrypt
    const hashedPassword = await hashPassword(password);

    //code for verification
    const verificationCode = generateVerificationCode();
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // Code expires in 15 minutes

    // Create and save the new user
    const newUser = AppDataSource.getRepository(User).create({ name: username, email, password: hashedPassword, is_verified: false, verification_code: verificationCode, code_expiry: expiryTime});
    await AppDataSource.getRepository(User).save(newUser);

    await sendVerificationEmail(email, verificationCode);
    
    return newUser;
  },

  //verify user via email
  verifyUser : async (email: string, code: string) => {
    const user1= AppDataSource.getRepository(User);
    const user = await user1.findOne({ where: { email, verification_code: code, is_verified: false } });
    if (user && user.code_expiry && user.code_expiry > new Date()) {
      user.is_verified = true;
      user.verification_code = null;
      user.code_expiry = null;
      await user1.save(user);
      return user;
    }
    return null;
  },

  // Function to authenticate a user (login)
  authenticateUser: async ( email: string, password: string) => {
    const user = await AppDataSource.getRepository(User).findOneBy({ email });
    if (!user) throw new Error('User not found');
    if (!user.is_verified) throw new Error('User not verified')

    // Verify password using bcrypt
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid password');

    // Generate a JWT token if authentication is successful
    const token = generateToken({ userId: user.id });

    return token;
  },
  // Function to update password
  updatePassword : async (userId: number, currentPassword: string, newPassword: string): Promise<void> => {
    const userRepository = AppDataSource.getRepository(User);

    // Fetch the user by ID
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
        throw new Error('User not found');
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
    }

    if( currentPassword === newPassword ){
      throw new Error('New password can not be same as old password')
    }

    // Hash the new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update user's password
    user.password = hashedNewPassword;

    // Save the updated user
    await userRepository.save(user);
  },
  // check wheather or not a user belongs to a family or not
  hasFamily : async (userId: number) => {
    const userRepository = AppDataSource.getRepository(User);

    // Fetch the user by ID
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['family'], // Ensure family relation is fetched
    });
    if (!user) {
      throw new Error('User not found' );
    }
    
    const hasFamily = !!user.family;

    if(hasFamily){
      return true;
    }
    else 
      return false;
  },
};
