// src/hooks/mutations/useLogout.ts
import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authApi, MessageResponse } from '@/api/endpoints/auth.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { useAuth } from '@/app/context/AuthContext';

export const useLogout = (
  options?: Omit<UseMutationOptions<MessageResponse, Error, void>, 'mutationFn'>,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const auth = useAuth();

  return useMutation<MessageResponse, Error, void>({
    mutationFn: () => authApi.logout(),
    onSuccess: (data, variables, context, _mutation) => {
      // Clear user from context
      auth.setUser(null);

      // Clear all queries from cache
      queryClient.clear();

      // Show success message
      toast.success(data.message || 'Logged out successfully');

      // Navigate to login
      router.push('/login');

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      // Even if logout fails on server, clear local state
      auth.setUser(null);
      queryClient.clear();
      router.push('/login');

      toast.error(error?.message || 'Logout failed');
      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
