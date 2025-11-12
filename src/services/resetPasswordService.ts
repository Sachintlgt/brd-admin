// src/services/resetPasswordService.ts
import { api } from '@/lib/api';

export type ResetPasswordResponse = { success: boolean; message?: string; data?: any };

export const resetPasswordService = {
  resetPassword: async (token: string, newPassword: string): Promise<ResetPasswordResponse> => {
    try {
      const { data } = await api.post<ResetPasswordResponse>(
        '/auth/reset-password',
        { token, newPassword },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );
      return data;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      const message =
        serverMessage ||
        (status === 400 ? 'Invalid or expired reset token' : err?.message || 'Failed to reset password');

      // Re-throw as Error with a user-friendly message for hooks/components to catch
      throw new Error(message);
    }
  },
};
