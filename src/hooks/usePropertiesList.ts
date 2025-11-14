/**
 * Custom hook for fetching properties using TanStack Query
 * Handles loading, error, and caching states automatically
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyListService } from '@/services/propertyListService';
import { PropertyListFilters, PropertyListResponse, PropertyListItem } from '@/types/property-list';
import { useState } from 'react';
import toast from 'react-hot-toast';

// Query keys factory for caching
export const propertyQueryKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyQueryKeys.all, 'list'] as const,
  list: (filters: PropertyListFilters) => [...propertyQueryKeys.lists(), { filters }] as const,
};

/**
 * Hook to fetch properties with filters, pagination, and sorting
 * Automatically handles caching and refetching
 */
export const usePropertiesList = (filters: PropertyListFilters) => {
  return useQuery<PropertyListResponse, Error>({
    queryKey: propertyQueryKeys.list(filters),
    queryFn: () => propertyListService.fetchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

/**
 * Hook to delete a property
 * Automatically invalidates the list query to trigger a refetch
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  return useMutation({
    mutationFn: (id: string) => propertyListService.deleteProperty(id),
    onMutate: (id: string) => {
      // Optimistic update
      queryClient.setQueriesData({ queryKey: propertyQueryKeys.lists() }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            properties: oldData.data.properties.filter((p: PropertyListItem) => p.id !== id),
          },
        };
      });
    },
    onSuccess: () => {
      toast.success('Property deleted successfully');
      // Invalidate list query to refetch from server
      queryClient.invalidateQueries({ queryKey: propertyQueryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete property');
    },
  });
};

/**
 * Hook to toggle property active status
 */
export const useToggleActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      propertyListService.toggleActiveProperty(id, isActive),
    onSuccess: () => {
      toast.success('Property status updated');
      queryClient.invalidateQueries({ queryKey: propertyQueryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update property status');
    },
  });
};

/**
 * Hook to toggle property featured status
 */
export const useToggleFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      propertyListService.toggleFeaturedProperty(id, isFeatured),
    onSuccess: () => {
      toast.success('Property featured status updated');
      queryClient.invalidateQueries({ queryKey: propertyQueryKeys.lists() });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update property featured status');
    },
  });
};
