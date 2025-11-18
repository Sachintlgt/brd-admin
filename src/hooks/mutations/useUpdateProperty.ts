import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { propertiesApi } from '@/api/endpoints/properties.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { UpdatePropertyPayload, PropertyResponse } from '@/services/propertyService';

interface UpdatePropertyVariables {
  id: string;
  payload: UpdatePropertyPayload;
}

export const useUpdateProperty = (
  options?: Omit<
    UseMutationOptions<PropertyResponse, Error, UpdatePropertyVariables>,
    'mutationFn'
  >,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<PropertyResponse, Error, UpdatePropertyVariables>({
    mutationFn: ({ id, payload }) => propertiesApi.updateProperty(id, payload),
    onSuccess: (data, variables, context, _mutation) => {
      toast.success(data.message || 'Property updated successfully');

      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.properties.detail(variables.id),
      });

      // Navigate after delay
      setTimeout(() => {
        router.push('/properties');
      }, 1500);

      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      const message = error?.message || 'Failed to update property';
      toast.error(message);

      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
