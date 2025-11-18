// src/hooks/queries/useUserQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { authApi, UserResponse } from '@/api/endpoints/auth.api';
import { queryKeys } from '@/lib/react-query/query-keys';

/**
 * Hook to fetch current user
 * Used for checking authentication status and getting user data
 */
export const useUserQuery = (
  options?: Omit<UseQueryOptions<UserResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<UserResponse, Error>({
    queryKey: queryKeys.auth.user(),
    queryFn: () => authApi.getMe(),
    retry: false, // Don't retry if user is not authenticated
    staleTime: 5 * 60 * 1000, // Consider fresh for 5 minutes
    ...options,
  });
};
