'use client';
import { useMutation } from '@tanstack/react-query';
import { resetPasswordService } from '@/services/resetPasswordService';

type Vars = { token: string; newPassword: string };

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({ token, newPassword }: Vars) => {
      const res = await resetPasswordService.resetPassword(token, newPassword);
      if (!res || !res.success) {
        throw new Error(res?.message || 'Failed to reset password');
      }
      return res;
    },
  });
};
