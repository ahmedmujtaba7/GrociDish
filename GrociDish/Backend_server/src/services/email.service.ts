import nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify Your Account',
    text: `Welcome to GrociDish\n\nYour verification code is ${code}\n\nTeam GrociDish`,
  };
  await transporter.sendMail(mailOptions);
};
