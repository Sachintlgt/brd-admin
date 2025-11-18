// src/api/endpoints/auth.api.ts
import { api } from '@/lib/api';

/**
 * User Interface
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * API Response Types
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data?: null;
}

/**
 * Request Payload Types
 */
export interface LoginPayload {
  username: string; // email
  password: string;
  role?: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

/**
 * Authentication API
 * Pure API calls without React Query logic
 */
export const authApi = {
  /**
   * Login user
   * POST /auth/login
   */
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
      email: payload.username,
      password: payload.password,
      role: payload.role,
    });
    return data;
  },

  /**
   * Signup new user
   * POST /auth/signup
   */
  signup: async (payload: SignupPayload): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/signup', payload);
    return data;
  },

  /**
   * Refresh access token
   * POST /auth/refresh-token
   */
  refreshToken: async (): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/refresh-token');
    return data;
  },

  /**
   * Get current user info
   * GET /auth/me
   */
  getMe: async (): Promise<UserResponse> => {
    const { data } = await api.get<UserResponse>('/auth/me');
    return data;
  },

  /**
   * Logout user
   * POST /auth/logout
   */
  logout: async (): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/auth/logout');
    return data;
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword: async (payload: ForgotPasswordPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>('/auth/forgot-password', payload);
    return data;
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (payload: ResetPasswordPayload): Promise<MessageResponse> => {
    const { data } = await api.post<MessageResponse>(
      '/auth/reset-password',
      {
        token: payload.token,
        newPassword: payload.newPassword,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );
    return data;
  },
};
