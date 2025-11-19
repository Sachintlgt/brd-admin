'use client';

import { useState } from 'react';
import { resetPasswordService } from '@/services/resetPasswordService';

type Vars = { token: string; newPassword: string };

export const useResetPassword = () => {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutateAsync = async (
    { token, newPassword }: Vars,
    options?: { onSuccess?: (res: any) => void },
  ) => {
    setIsPending(true);
    setError(null);

    try {
      const res = await resetPasswordService.resetPassword(token, newPassword);

      if (!res || !res.success) {
        throw new Error(res?.message || 'Failed to reset password');
      }

      if (options?.onSuccess) {
        options.onSuccess(res);
      }

      return res;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return {
    mutateAsync,
    isPending,
    error,
  };
};
