'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { propertyListService } from '@/services/propertyListService';
import { PropertyListFilters, PropertyListResponse } from '@/types/property-list';
import toast from 'react-hot-toast';

interface Staff {
  id: string;
  name: string;
}

interface PropertiesContextType {
  // Data
  properties: any[];
  pagination: any;
  staff: Staff[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProperties: (filters: PropertyListFilters) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  refreshProperties: () => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

const initialStaff: Staff[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

export const PropertiesProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [staff] = useState<Staff[]>(initialStaff);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFilters, setLastFilters] = useState<PropertyListFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const fetchProperties = useCallback(async (filters: PropertyListFilters) => {
    setIsLoading(true);
    setError(null);
    setLastFilters(filters);

    try {
      const response: PropertyListResponse = await propertyListService.fetchProperties(filters);

      if (response.success && response.data) {
        setProperties(response.data.properties || []);
        setPagination(
          response.data.pagination || {
            page: filters.page || 1,
            limit: filters.limit || 10,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: false,
          },
        );
      } else {
        throw new Error(response?.message || 'Failed to fetch properties');
      }
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to fetch properties';
      setError(errorMessage);
      toast.error(errorMessage);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshProperties = useCallback(async () => {
    await fetchProperties(lastFilters);
  }, [lastFilters, fetchProperties]);

  const deleteProperty = useCallback(
    async (id: string) => {
      try {
        // Optimistic update
        setProperties((prev) => prev.filter((p) => p.id !== id));

        await propertyListService.deleteProperty(id);
        toast.success('Property deleted successfully');

        // Refresh to get accurate data
        await refreshProperties();
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to delete property';
        toast.error(errorMessage);
        // Revert optimistic update on error
        await refreshProperties();
      }
    },
    [refreshProperties],
  );

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        pagination,
        staff,
        isLoading,
        error,
        fetchProperties,
        deleteProperty,
        refreshProperties,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) throw new Error('useProperties must be used within PropertiesProvider');
  return context;
};
