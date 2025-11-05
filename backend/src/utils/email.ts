import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
  
  await transporter.sendMail({
    from: config.email.user,
    to: email,
    subject: 'Verify Your Email - IDStock',
    html: `
      <h1>Email Verification</h1>
      <p>Thank you for registering with IDStock. Please click the link below to verify your email:</p>
      <a href="${verificationUrl}">Verify Email</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
  
  await transporter.sendMail({
    from: config.email.user,
    to: email,
    subject: 'Password Reset - IDStock',
    html: `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to proceed:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};
