'use client';

import { useState } from 'react';
import { forgotPasswordService, ForgotPasswordResponse } from '@/services/forgotPasswordService';

export type ForgotPasswordVars = { email: string };

export const useForgotPassword = () => {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<any>(null);

  const mutateAsync = async (
    { email }: ForgotPasswordVars,
    options?: { onSuccess?: () => void },
  ): Promise<ForgotPasswordResponse> => {
    setIsPending(true);
    setIsSuccess(false);
    setError(null);

    try {
      const response = await forgotPasswordService.forgotPassword(email);
      setIsSuccess(true);

      if (options?.onSuccess) {
        options.onSuccess();
      }

      return response;
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
    isSuccess,
    error,
  };
};
