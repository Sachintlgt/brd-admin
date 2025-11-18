import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertiesApi } from '@/api/endpoints/properties.api';
import { queryKeys } from '@/lib/react-query/query-keys';

interface ToggleActiveVariables {
  id: string;
  isActive: boolean;
}

interface ToggleFeaturedVariables {
  id: string;
  isFeatured: boolean;
}

export const useToggleActive = (
  options?: Omit<
    UseMutationOptions<{ success: boolean; data: any }, Error, ToggleActiveVariables>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: any }, Error, ToggleActiveVariables>({
    mutationFn: ({ id, isActive }) => propertiesApi.toggleActive(id, isActive),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.properties.lists() });

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.properties.lists(),
      });

      // Optimistic update
      queryClient.setQueriesData({ queryKey: queryKeys.properties.lists() }, (oldData: any) => {
        if (!oldData?.data?.properties) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            properties: oldData.data.properties.map((p: any) =>
              p.id === id ? { ...p, isActive } : p,
            ),
          },
        };
      });

      return { previousData };
    },
    onSuccess: (data, variables, context, _mutation) => {
      toast.success('Property status updated');
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context: any, _mutation) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(error?.message || 'Failed to update status');
      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};

export const useToggleFeatured = (
  options?: Omit<
    UseMutationOptions<{ success: boolean; data: any }, Error, ToggleFeaturedVariables>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean; data: any }, Error, ToggleFeaturedVariables>({
    mutationFn: ({ id, isFeatured }) => propertiesApi.toggleFeatured(id, isFeatured),
    onMutate: async ({ id, isFeatured }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.properties.lists() });

      const previousData = queryClient.getQueriesData({
        queryKey: queryKeys.properties.lists(),
      });

      queryClient.setQueriesData({ queryKey: queryKeys.properties.lists() }, (oldData: any) => {
        if (!oldData?.data?.properties) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            properties: oldData.data.properties.map((p: any) =>
              p.id === id ? { ...p, isFeatured } : p,
            ),
          },
        };
      });

      return { previousData };
    },
    onSuccess: (data, variables, context, _mutation) => {
      toast.success('Featured status updated');
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context: any, _mutation) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]: [any, any]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(error?.message || 'Failed to update featured status');
      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
