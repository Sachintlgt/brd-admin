// src/hooks/mutations/useForgotPassword.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { authApi, ForgotPasswordPayload, MessageResponse } from '@/api/endpoints/auth.api';

export const useForgotPassword = (
  options?: Omit<UseMutationOptions<MessageResponse, Error, ForgotPasswordPayload>, 'mutationFn'>,
) => {
  return useMutation<MessageResponse, Error, ForgotPasswordPayload>({
    mutationFn: (payload) => authApi.forgotPassword(payload),
    onSuccess: (data, variables, context, _mutation) => {
      toast.success(
        data.message ||
          "If that email exists in our system, we've sent password reset instructions.",
      );

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      // Don't show specific error for security (don't reveal if email exists)
      // Error handling will be done in component for field-specific errors
      console.error('Forgot password error:', error);

      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
