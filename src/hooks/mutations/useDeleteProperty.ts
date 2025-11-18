import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertiesApi } from '@/api/endpoints/properties.api';
import { queryKeys } from '@/lib/react-query/query-keys';

export const useDeleteProperty = (
  options?: Omit<
    UseMutationOptions<{ success: boolean; message: string }, Error, string>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; message: string }, Error, string>({
    mutationFn: (id) => propertiesApi.deleteProperty(id),
    onMutate: async (id) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.properties.lists() });

      // Snapshot previous value
      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.properties.lists(),
      });

      // Optimistically update: remove property from all list queries
      queryClient.setQueriesData({ queryKey: queryKeys.properties.lists() }, (oldData: any) => {
        if (!oldData?.data?.properties) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            properties: oldData.data.properties.filter((p: any) => p.id !== id),
            pagination: {
              ...oldData.data.pagination,
              total: Math.max(0, oldData.data.pagination.total - 1),
            },
          },
        };
      });

      // Return context for rollback
      return { previousData };
    },
    onSuccess: (data, variables, context, _mutation) => {
      toast.success(data.message || 'Property deleted successfully');

      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() });

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context: any, _mutation) => {
      // Rollback on error
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      const message = error?.message || 'Failed to delete property';
      toast.error(message);

      options?.onError?.(error, variables, context, _mutation);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() });
    },
    ...options,
  });
};
