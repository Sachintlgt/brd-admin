// src/hooks/mutations/useSignup.ts
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, SignupPayload, AuthResponse } from '@/api/endpoints/auth.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useAuth } from '@/app/context/AuthContext';

export const useSignup = (
  options?: Omit<UseMutationOptions<AuthResponse, Error, SignupPayload>, 'mutationFn'>,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation<AuthResponse, Error, SignupPayload>({
    mutationFn: (payload) => authApi.signup(payload),
    onSuccess: (data, variables, context, _mutation) => {
      // Update user in context
      auth.setUser(data.data.user);

      // Update cache
      queryClient.setQueryData(queryKeys.auth.user(), {
        success: true,
        message: 'User fetched',
        data: { user: data.data.user },
      });

      // Show success message
      toast.success(data.message || 'Account created successfully');

      // Navigate to dashboard
      router.push('/dashboard');

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      console.error('Signup error:', error);
      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
