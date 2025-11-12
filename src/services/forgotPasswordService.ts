// src/services/forgotPasswordService.ts
import { api } from '@/lib/api';

export type ForgotPasswordResponse = { success: boolean; message?: string  };

export const forgotPasswordService = {
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const { data } = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
    return data;
  },
};
