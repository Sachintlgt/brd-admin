// src/hooks/mutations/useLogin.ts
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, LoginPayload, AuthResponse } from '@/api/endpoints/auth.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useAuth } from '@/app/context/AuthContext';

export const useLogin = (
  options?: Omit<UseMutationOptions<AuthResponse, Error, LoginPayload>, 'mutationFn'>,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation<AuthResponse, Error, LoginPayload>({
    mutationFn: (payload) => authApi.login(payload),
    onSuccess: (data, variables, context, _mutation) => {
      // Update user in context
      auth.setUser(data.data.user);

      // Update cache with user data
      queryClient.setQueryData(queryKeys.auth.user(), {
        success: true,
        message: 'User fetched',
        data: { user: data.data.user },
      });

      // Refresh user to sync with cookies
      auth.refreshUser();

      // Show success message
      toast.success(data.message || 'Login successful');

      // Navigate to dashboard
      router.push('/dashboard');

      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      // Error handling is done in the component
      // But we can log here
      console.error('Login error:', error);

      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
