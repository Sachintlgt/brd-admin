// src/lib/react-query/query-client.ts
import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 4xx errors (client errors)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
  },
  mutations: {
    retry: false,
    onError: (error: any) => {
      // Global error handler for mutations
      const message = error?.message || 'An error occurred';
      console.error('Mutation error:', error);
      // Don't show toast here - let individual mutations handle it
    },
  },
};

export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Optional: Create a function to clear all queries on logout
export const clearQueryCache = () => {
  queryClient.clear();
};
