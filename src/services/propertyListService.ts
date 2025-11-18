/**
 * Property List Service
 * Handles API calls for fetching property lists with filters, pagination, and sorting
 */

import { api } from '@/lib/api';
import { PropertyListResponse, PropertyListFilters } from '@/types/property-list';

export const propertyListService = {
  /**
   * Fetch properties with filters, pagination, and sorting
   * GET /properties
   */
  fetchProperties: async (filters: PropertyListFilters): Promise<PropertyListResponse> => {
    try {
      // Build query parameters
      const params: Record<string, any> = {};

      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      if (filters.search) params.search = filters.search;
      if (filters.name) params.name = filters.name;
      if (filters.location) params.location = filters.location;
      if (filters.isActive !== undefined) params.isActive = filters.isActive;
      if (filters.isFeatured !== undefined) params.isFeatured = filters.isFeatured;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.staffId) params.staffId = filters.staffId;

      const { data: responseData } = await api.get<any>('/properties', {
        params,
      });

      const properties = Array.isArray(responseData?.data) ? responseData.data : [];
      const paginationData = responseData?.pagination || {};

      const response: PropertyListResponse = {
        success: responseData?.success ?? true,
        data: {
          properties,
          pagination: {
            page: paginationData.currentPage || filters.page || 1,
            limit: paginationData.limit || filters.limit || 10,
            total: paginationData.totalRecords || 0,
            totalPages: paginationData.totalPages || 0,
            hasNextPage: paginationData.hasNextPage ?? false,
            hasPrevPage: paginationData.hasPreviousPage ?? false,
          },
        },
      };

      return response;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;

      let message = serverMessage || err?.message || 'Failed to fetch properties';

      const error: any = new Error(message);
      error.status = status;
      throw error;
    }
  },

  /**
   * Delete a property
   * DELETE /properties/:id
   */
  deleteProperty: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const { data } = await api.delete(`/properties/${id}`);
      return data;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;

      let message = serverMessage || err?.message || 'Failed to delete property';

      const error: any = new Error(message);
      error.status = status;
      throw error;
    }
  },

  /**
   * Toggle property active status
   * PATCH /properties/:id/toggle-active
   */
  toggleActiveProperty: async (
    id: string,
    isActive: boolean,
  ): Promise<{ success: boolean; data: any }> => {
    try {
      const { data } = await api.patch(`/properties/${id}/toggle-active`, {
        isActive,
      });
      return data;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;

      let message = serverMessage || err?.message || 'Failed to update property status';

      const error: any = new Error(message);
      error.status = status;
      throw error;
    }
  },

  /**
   * Toggle property featured status
   * PATCH /properties/:id/toggle-featured
   */
  toggleFeaturedProperty: async (
    id: string,
    isFeatured: boolean,
  ): Promise<{ success: boolean; data: any }> => {
    try {
      const { data } = await api.patch(`/properties/${id}/toggle-featured`, {
        isFeatured,
      });
      return data;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;

      let message = serverMessage || err?.message || 'Failed to update property featured status';

      const error: any = new Error(message);
      error.status = status;
      throw error;
    }
  },
};
