import { Request, Response } from 'express';
import { User } from '../models';
import { generateToken, generateVerificationToken } from '../utils/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name, phone_number, profile_data } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const password_hash = await User.hashPassword(password);
    const verification_token = generateVerificationToken();

    // Create user
    const user = await User.create({
      email,
      password_hash,
      full_name,
      phone_number,
      profile_data,
      verification_token,
      is_verified: false,
    });

    // Send verification email
    try {
      await sendVerificationEmail(email, verification_token);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
    }

    const token = generateToken(user.user_id);

    res.status(201).json({
      message: 'User created successfully. Please check your email for verification.',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember_me } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    const token = generateToken(user.user_id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        email: user.email,
        full_name: user.full_name,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ where: { verification_token: token } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    user.is_verified = true;
    user.verification_token = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
};

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If the email exists, a reset link will be sent' });
    }

    const resetToken = generateVerificationToken();
    user.reset_password_token = resetToken;
    user.reset_password_expires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    try {
      await sendPasswordResetEmail(email, resetToken);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.json({ message: 'If the email exists, a reset link will be sent' });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({ error: 'Password reset request failed' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, new_password } = req.body;

    const user = await User.findOne({
      where: { reset_password_token: token },
    });

    if (!user || !user.reset_password_expires || user.reset_password_expires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    user.password_hash = await User.hashPassword(new_password);
    user.reset_password_token = undefined;
    user.reset_password_expires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
};
