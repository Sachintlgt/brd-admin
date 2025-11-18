// src/api/endpoints/properties.api.ts
import { api } from '@/lib/api';
import { PropertyListResponse, PropertyListFilters } from '@/types/property-list';
import {
  PropertyResponse,
  CreatePropertyPayload,
  UpdatePropertyPayload,
} from '@/services/propertyService';

/**
 * Properties API
 * Pure API calls without React Query logic
 */
export const propertiesApi = {
  /**
   * Fetch properties list with filters
   */
  getProperties: async (filters: PropertyListFilters): Promise<PropertyListResponse> => {
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

    const { data: responseData } = await api.get<any>('/properties', { params });

    const properties = Array.isArray(responseData?.data) ? responseData.data : [];
    const paginationData = responseData?.pagination || {};

    return {
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
  },

  /**
   * Get single property by ID
   */
  getPropertyById: async (id: string): Promise<PropertyResponse> => {
    const { data } = await api.get<PropertyResponse>(`/properties/${id}`);
    return data;
  },

  /**
   * Create new property
   */
  createProperty: async (payload: CreatePropertyPayload): Promise<PropertyResponse> => {
    const formData = buildPropertyFormData(payload);

    const { data } = await api.post<PropertyResponse>('/properties', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  /**
   * Update property
   */
  updateProperty: async (id: string, payload: UpdatePropertyPayload): Promise<PropertyResponse> => {
    const formData = buildPropertyFormData(payload, true);

    const { data } = await api.patch<PropertyResponse>(`/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data;
  },

  /**
   * Delete property
   */
  deleteProperty: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete(`/properties/${id}`);
    return data;
  },

  /**
   * Toggle property active status
   */
  toggleActive: async (id: string, isActive: boolean): Promise<{ success: boolean; data: any }> => {
    const { data } = await api.patch(`/properties/${id}/toggle-active`, { isActive });
    return data;
  },

  /**
   * Toggle property featured status
   */
  toggleFeatured: async (
    id: string,
    isFeatured: boolean,
  ): Promise<{ success: boolean; data: any }> => {
    const { data } = await api.patch(`/properties/${id}/toggle-featured`, { isFeatured });
    return data;
  },
};

/**
 * Helper: Build FormData for property create/update
 */
function buildPropertyFormData(
  payload: CreatePropertyPayload | UpdatePropertyPayload,
  isUpdate = false,
): FormData {
  const formData = new FormData();

  // Basic fields
  if ('name' in payload && payload.name) formData.append('name', payload.name);
  if ('location' in payload && payload.location) formData.append('location', payload.location);
  if ('description' in payload && payload.description !== undefined) {
    formData.append('description', payload.description);
  }

  // Numeric fields
  if ('beds' in payload && payload.beds !== undefined) {
    formData.append('beds', String(payload.beds));
  }
  if ('bathrooms' in payload && payload.bathrooms !== undefined) {
    formData.append('bathrooms', String(payload.bathrooms));
  }
  if ('sqft' in payload && payload.sqft !== undefined) {
    formData.append('sqft', String(payload.sqft));
  }
  if ('maxOccupancy' in payload && payload.maxOccupancy) {
    formData.append('maxOccupancy', payload.maxOccupancy);
  }

  // Share fields
  if ('totalShares' in payload && payload.totalShares !== undefined) {
    formData.append('totalShares', String(payload.totalShares));
  }
  if ('availableShares' in payload && payload.availableShares !== undefined) {
    formData.append('availableShares', String(payload.availableShares));
  }
  if ('initialPricePerShare' in payload && payload.initialPricePerShare !== undefined) {
    formData.append('initialPricePerShare', String(payload.initialPricePerShare));
  }
  if ('currentPricePerShare' in payload && payload.currentPricePerShare !== undefined) {
    formData.append('currentPricePerShare', String(payload.currentPricePerShare));
  }
  if ('wholeUnitPrice' in payload && payload.wholeUnitPrice !== undefined) {
    formData.append('wholeUnitPrice', String(payload.wholeUnitPrice));
  }

  // Financial fields
  if ('targetIRR' in payload && payload.targetIRR !== undefined) {
    formData.append('targetIRR', String(payload.targetIRR));
  }
  if ('targetRentalYield' in payload && payload.targetRentalYield) {
    formData.append('targetRentalYield', payload.targetRentalYield);
  }
  if ('appreciationRate' in payload && payload.appreciationRate !== undefined) {
    formData.append('appreciationRate', String(payload.appreciationRate));
  }

  // Dates
  if ('possessionDate' in payload && payload.possessionDate) {
    formData.append('possessionDate', payload.possessionDate);
  }
  if ('launchDate' in payload && payload.launchDate) {
    formData.append('launchDate', payload.launchDate);
  }

  // Booking fields
  if ('maxBookingDays' in payload && payload.maxBookingDays !== undefined) {
    formData.append('maxBookingDays', String(payload.maxBookingDays));
  }
  if ('bookingAmount' in payload && payload.bookingAmount !== undefined) {
    formData.append('bookingAmount', String(payload.bookingAmount));
  }
  if ('bookingAmountGST' in payload && payload.bookingAmountGST !== undefined) {
    formData.append('bookingAmountGST', String(payload.bookingAmountGST));
  }

  // Boolean fields
  if ('isActive' in payload && payload.isActive !== undefined) {
    formData.append('isActive', String(payload.isActive));
  }
  if ('isFeatured' in payload && payload.isFeatured !== undefined) {
    formData.append('isFeatured', String(payload.isFeatured));
  }

  // Text fields for comma-separated names
  if ('amenityNames' in payload && payload.amenityNames) {
    formData.append('amenityNames', payload.amenityNames);
  }
  if ('documentNames' in payload && payload.documentNames) {
    formData.append('documentNames', payload.documentNames);
  }
  if ('certificateNames' in payload && payload.certificateNames) {
    formData.append('certificateNames', payload.certificateNames);
  }
  if ('floorPlanNames' in payload && payload.floorPlanNames) {
    formData.append('floorPlanNames', payload.floorPlanNames);
  }

  // Update-specific: IDs to delete
  if (isUpdate && 'imageIdsToDelete' in payload && payload.imageIdsToDelete?.length) {
    formData.append('imageIdsToDelete', JSON.stringify(payload.imageIdsToDelete));
  }
  if (isUpdate && 'amenityIdsToDelete' in payload && payload.amenityIdsToDelete?.length) {
    formData.append('amenityIdsToDelete', JSON.stringify(payload.amenityIdsToDelete));
  }
  if (isUpdate && 'documentIdsToDelete' in payload && payload.documentIdsToDelete?.length) {
    formData.append('documentIdsToDelete', JSON.stringify(payload.documentIdsToDelete));
  }
  if (isUpdate && 'pricingIdsToDelete' in payload && payload.pricingIdsToDelete?.length) {
    formData.append('pricingIdsToDelete', JSON.stringify(payload.pricingIdsToDelete));
  }
  if (isUpdate && 'shareDetailIdsToDelete' in payload && payload.shareDetailIdsToDelete?.length) {
    formData.append('shareDetailIdsToDelete', JSON.stringify(payload.shareDetailIdsToDelete));
  }
  if (
    isUpdate &&
    'maintenanceTemplateIdsToDelete' in payload &&
    payload.maintenanceTemplateIdsToDelete?.length
  ) {
    formData.append(
      'maintenanceTemplateIdsToDelete',
      JSON.stringify(payload.maintenanceTemplateIdsToDelete),
    );
  }
  if (isUpdate && 'certificateIdsToDelete' in payload && payload.certificateIdsToDelete?.length) {
    formData.append('certificateIdsToDelete', JSON.stringify(payload.certificateIdsToDelete));
  }
  if (isUpdate && 'floorPlanIdsToDelete' in payload && payload.floorPlanIdsToDelete?.length) {
    formData.append('floorPlanIdsToDelete', JSON.stringify(payload.floorPlanIdsToDelete));
  }
  if (isUpdate && 'paymentPlanIdsToDelete' in payload && payload.paymentPlanIdsToDelete?.length) {
    formData.append('paymentPlanIdsToDelete', JSON.stringify(payload.paymentPlanIdsToDelete));
  }
  if (isUpdate && 'highlightIdsToDelete' in payload && payload.highlightIdsToDelete?.length) {
    formData.append('highlightIdsToDelete', JSON.stringify(payload.highlightIdsToDelete));
  }

  // File uploads
  if ('propertyImages' in payload && payload.propertyImages?.length) {
    payload.propertyImages.forEach((file) => formData.append('propertyImages', file));
  }
  if ('propertyVideos' in payload && payload.propertyVideos?.length) {
    payload.propertyVideos.forEach((file) => formData.append('propertyVideos', file));
  }
  if ('amenityIcons' in payload && payload.amenityIcons?.length) {
    payload.amenityIcons.forEach((file) => formData.append('amenityIcons', file));
  }
  if ('documents' in payload && payload.documents?.length) {
    payload.documents.forEach((file) => formData.append('documents', file));
  }
  if ('certificateImages' in payload && payload.certificateImages?.length) {
    payload.certificateImages.forEach((file) => formData.append('certificateImages', file));
  }
  if ('floorPlanImages' in payload && payload.floorPlanImages?.length) {
    payload.floorPlanImages.forEach((file) => formData.append('floorPlanImages', file));
  }

  // JSON arrays
  if ('pricingDetails' in payload && payload.pricingDetails?.length) {
    formData.append('pricingDetails', JSON.stringify(payload.pricingDetails));
  }
  if ('shareDetails' in payload && payload.shareDetails?.length) {
    formData.append('shareDetails', JSON.stringify(payload.shareDetails));
  }
  if ('maintenanceTemplates' in payload && payload.maintenanceTemplates?.length) {
    formData.append('maintenanceTemplates', JSON.stringify(payload.maintenanceTemplates));
  }
  if ('highlights' in payload && payload.highlights?.length) {
    formData.append('highlights', JSON.stringify(payload.highlights));
  }
  if ('certificates' in payload && payload.certificates?.length) {
    formData.append('certificates', JSON.stringify(payload.certificates));
  }
  if ('floorPlans' in payload && payload.floorPlans?.length) {
    formData.append('floorPlans', JSON.stringify(payload.floorPlans));
  }
  if ('paymentPlans' in payload && payload.paymentPlans?.length) {
    formData.append('paymentPlans', JSON.stringify(payload.paymentPlans));
  }

  return formData;
}
