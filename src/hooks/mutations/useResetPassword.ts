// src/hooks/mutations/useResetPassword.ts
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, ResetPasswordPayload, MessageResponse } from '@/api/endpoints/auth.api';

export const useResetPassword = (
  options?: Omit<UseMutationOptions<MessageResponse, Error, ResetPasswordPayload>, 'mutationFn'>,
) => {
  const router = useRouter();

  return useMutation<MessageResponse, Error, ResetPasswordPayload>({
    mutationFn: (payload) => authApi.resetPassword(payload),
    onSuccess: (data, variables, context, _mutation) => {
      toast.success(data.message || 'Password reset successful');

      // Navigate to login after short delay
      setTimeout(() => {
        router.push('/login');
      }, 1500);

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      // Error handling will be done in component
      console.error('Reset password error:', error);

      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
