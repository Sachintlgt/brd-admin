// src/hooks/queries/usePropertyQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { propertiesApi } from '@/api/endpoints/properties.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { PropertyResponse } from '@/types/property-list';

/**
 * Hook to fetch single property by ID
 */
export const usePropertyQuery = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<PropertyResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<PropertyResponse, Error>({
    queryKey: queryKeys.properties.detail(id!),
    queryFn: () => propertiesApi.getPropertyById(id!),
    enabled: !!id, // Only run query if ID exists
    ...options,
  });
};
