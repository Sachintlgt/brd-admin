// src/services/authService.ts
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginData {
  username: string; // email
  password: string;
  role?: string;
}

export const authService = {
  /**
   * Login user
   * Backend sets cookies automatically
   */
  login: async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', {
      email: data.username,
      password: data.password,
      role: data.role,
    });
    return response.data;
  },

  /**
   * Signup new user
   * Backend sets cookies automatically
   */
  signup: async (data: SignupData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/signup', data);
    return response.data;
  },

  /**
   * Refresh access token
   * Backend updates cookies automatically
   */
  refreshToken: async (): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh-token');
    return response.data;
  },

  /**
   * Get current user info
   */
  getMe: async (): Promise<{ message: string; data: { user: User } }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   * Backend clears cookies
   */
  logout: async (): Promise<{ message: string; data: null }> => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
};
