import api from './api';
import { LoginCredentials, SignupData, User } from '../types';

export const authService = {
  async signup(data: SignupData): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/request-password-reset', { email });
  },

  async resetPassword(token: string, new_password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, new_password });
  },
};
