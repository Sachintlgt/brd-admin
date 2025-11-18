// src/hooks/queries/usePropertiesQuery.ts
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { propertiesApi } from '@/api/endpoints/properties.api';
import { queryKeys } from '@/lib/react-query/query-keys';
import { PropertyListResponse, PropertyListFilters } from '@/types/property-list';

/**
 * Hook to fetch properties list with filters
 */
export const usePropertiesQuery = (
  filters: PropertyListFilters,
  options?: Omit<UseQueryOptions<PropertyListResponse, Error>, 'queryKey' | 'queryFn'>,
) => {
  return useQuery<PropertyListResponse, Error>({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => propertiesApi.getProperties(filters),
    ...options,
  });
};
