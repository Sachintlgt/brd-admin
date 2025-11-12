// src/services/authService.ts
import { api } from '@/lib/api';

export type LoginPayload = { username: string; password: string };
export type User = { id: string; email: string; name: string; role: string };
export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
};

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email: payload.username,
      password: payload.password,
    });
    return data;
  },
  // optionally fetch current user if your backend exposes /auth/me
  getMe: async (): Promise<User> => {
    const { data } = await api.get<{ data: { user: User } }>('/auth/me');
    return data.data.user;
  },

  logout: async () => {
    try {
      await Promise.resolve();
    } catch {}
  },
};
