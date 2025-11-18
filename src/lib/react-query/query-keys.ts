// src/lib/react-query/query-keys.ts
import { PropertyListFilters } from '@/types/property-list';

/**
 * Centralized query key factory
 * This ensures consistent cache keys across the application
 */
export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    user: () => [...queryKeys.auth.all, 'user'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // Properties
  properties: {
    all: ['properties'] as const,
    lists: () => [...queryKeys.properties.all, 'list'] as const,
    list: (filters: PropertyListFilters) => [...queryKeys.properties.lists(), { filters }] as const,
    details: () => [...queryKeys.properties.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.properties.details(), id] as const,
  },

  // Add more resource keys as needed
  // staff: { ... },
  // bookings: { ... },
} as const;

// Helper type for query key arrays
export type QueryKey = ReturnType<any>;
