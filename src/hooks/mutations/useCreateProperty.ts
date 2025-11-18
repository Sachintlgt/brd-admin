import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { propertiesApi } from '@/api/endpoints/properties.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { CreatePropertyPayload, PropertyResponse } from '@/services/propertyService';

export const useCreateProperty = (
  options?: Omit<UseMutationOptions<PropertyResponse, Error, CreatePropertyPayload>, 'mutationFn'>,
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<PropertyResponse, Error, CreatePropertyPayload>({
    mutationFn: (payload) => propertiesApi.createProperty(payload),
    onSuccess: (data, variables, context, _mutation) => {
      toast.success(data.message || 'Property created successfully');

      // Invalidate properties list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.lists() });

      // Navigate to properties list after short delay
      setTimeout(() => {
        router.push('/properties');
      }, 1500);

      // Call custom onSuccess if provided
      options?.onSuccess?.(data, variables, context, _mutation);
    },
    onError: (error: any, variables, context, _mutation) => {
      const message = error?.message || 'Failed to create property';
      toast.error(message);

      // Call custom onError if provided
      options?.onError?.(error, variables, context, _mutation);
    },
    ...options,
  });
};
