// src/services/propertyService.ts
import { api } from '@/lib/api';

export interface PropertyResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface CreatePropertyPayload {
  name: string;
  location: string;
  description?: string;
  totalShares: number;
  availableShares: number;
  pricePerShare: number;
  appreciationRate?: number;
  maxBookingDays?: number;
  isActive: boolean;
  isFeatured: boolean;
  amenityNames?: string;
  documentNames?: string;
  propertyImages: File[];
  propertyVideos?: File[];
  amenityIcons?: File[];
  documents?: File[];
  pricingDetails?: any[];
  shareDetails?: any[];
  maintenanceTemplates?: any[];
}

export interface UpdatePropertyPayload {
  name?: string;
  location?: string;
  description?: string;
  totalShares?: number;
  availableShares?: number;
  pricePerShare?: number;
  appreciationRate?: number;
  maxBookingDays?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  amenityNames?: string;
  documentNames?: string;
  imageIdsToDelete?: string[];
  amenityIdsToDelete?: string[];
  documentIdsToDelete?: string[];
  pricingIdsToDelete?: string[];
  shareDetailIdsToDelete?: string[];
  maintenanceTemplateIdsToDelete?: string[];
  propertyImages?: File[];
  propertyVideos?: File[];
  amenityIcons?: File[];
  documents?: File[];
  pricingDetails?: any[];
  shareDetails?: any[];
  maintenanceTemplates?: any[];
}

export const propertyService = {
  createProperty: async (payload: CreatePropertyPayload): Promise<PropertyResponse> => {
    try {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('location', payload.location);
      if (payload.description) formData.append('description', payload.description);

      formData.append('totalShares', String(payload.totalShares));
      formData.append('availableShares', String(payload.availableShares));
      formData.append('pricePerShare', String(payload.pricePerShare));

      if (payload.appreciationRate !== undefined) {
        formData.append('appreciationRate', String(payload.appreciationRate));
      }

      if (payload.maxBookingDays !== undefined) {
        formData.append('maxBookingDays', String(payload.maxBookingDays));
      }

      formData.append('isActive', String(payload.isActive));
      formData.append('isFeatured', String(payload.isFeatured));

      if (payload.amenityNames) formData.append('amenityNames', payload.amenityNames);
      if (payload.documentNames) formData.append('documentNames', payload.documentNames);

      if (payload.propertyImages?.length) {
        payload.propertyImages.forEach((file) => formData.append('propertyImages', file));
      }
      if (payload.propertyVideos?.length) {
        payload.propertyVideos.forEach((file) => formData.append('propertyVideos', file));
      }
      if (payload.amenityIcons?.length) {
        payload.amenityIcons.forEach((file) => formData.append('amenityIcons', file));
      }
      if (payload.documents?.length) {
        payload.documents.forEach((file) => formData.append('documents', file));
      }

      if (payload.pricingDetails?.length) {
        formData.append('pricingDetails', JSON.stringify(payload.pricingDetails));
      }
      if (payload.shareDetails?.length) {
        formData.append('shareDetails', JSON.stringify(payload.shareDetails));
      }
      if (payload.maintenanceTemplates?.length) {
        formData.append('maintenanceTemplates', JSON.stringify(payload.maintenanceTemplates));
      }

      const { data } = await api.post<PropertyResponse>('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (err: any) {
      // ✅ only NEW logic: detect and rethrow permission error
      if (err?.isPermissionError || err?.response?.status === 403) {
        const permissionError: any = new Error(
          err?.message || 'You do not have sufficient permissions.',
        );
        permissionError.isPermissionError = true;
        permissionError.status = 403;
        throw permissionError;
      }

      // --- your existing error logic ---
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      const errors = err?.response?.data?.errors;

      let message = serverMessage || err?.message || 'Failed to create property';

      if (errors && typeof errors === 'object') {
        const errorList = Object.entries(errors)
          .map(([field, messages]: any) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('\n');
        message = `Validation Errors:\n${errorList}`;
      }

      const error: any = new Error(message);
      error.status = status;
      error.errors = errors;
      throw error;
    }
  },

  getPropertyById: async (id: string): Promise<PropertyResponse> => {
    try {
      const { data } = await api.get<PropertyResponse>(`/properties/${id}`);
      return data;
    } catch (err: any) {
      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      let message = serverMessage || err?.message || 'Failed to fetch property';

      const error: any = new Error(message);
      error.status = status;
      throw error;
    }
  },

  updateProperty: async (id: string, payload: UpdatePropertyPayload): Promise<PropertyResponse> => {
    try {
      const formData = new FormData();

      // Basic fields
      if (payload.name) formData.append('name', payload.name);
      if (payload.location) formData.append('location', payload.location);
      if (payload.description !== undefined) formData.append('description', payload.description);

      // Numeric fields
      if (payload.totalShares !== undefined)
        formData.append('totalShares', String(payload.totalShares));
      if (payload.availableShares !== undefined)
        formData.append('availableShares', String(payload.availableShares));
      if (payload.pricePerShare !== undefined)
        formData.append('pricePerShare', String(payload.pricePerShare));
      if (payload.appreciationRate !== undefined)
        formData.append('appreciationRate', String(payload.appreciationRate));
      if (payload.maxBookingDays !== undefined)
        formData.append('maxBookingDays', String(payload.maxBookingDays));

      // Boolean fields
      if (payload.isActive !== undefined) formData.append('isActive', String(payload.isActive));
      if (payload.isFeatured !== undefined)
        formData.append('isFeatured', String(payload.isFeatured));

      // Text fields
      if (payload.amenityNames) formData.append('amenityNames', payload.amenityNames);
      if (payload.documentNames) formData.append('documentNames', payload.documentNames);

      // Delete IDs arrays
      if (payload.imageIdsToDelete?.length) {
        formData.append('imageIdsToDelete', JSON.stringify(payload.imageIdsToDelete));
      }
      if (payload.amenityIdsToDelete?.length) {
        formData.append('amenityIdsToDelete', JSON.stringify(payload.amenityIdsToDelete));
      }
      if (payload.documentIdsToDelete?.length) {
        formData.append('documentIdsToDelete', JSON.stringify(payload.documentIdsToDelete));
      }
      if (payload.pricingIdsToDelete?.length) {
        formData.append('pricingIdsToDelete', JSON.stringify(payload.pricingIdsToDelete));
      }
      if (payload.shareDetailIdsToDelete?.length) {
        formData.append('shareDetailIdsToDelete', JSON.stringify(payload.shareDetailIdsToDelete));
      }
      if (payload.maintenanceTemplateIdsToDelete?.length) {
        formData.append(
          'maintenanceTemplateIdsToDelete',
          JSON.stringify(payload.maintenanceTemplateIdsToDelete),
        );
      }

      // Structured data
      if (payload.pricingDetails?.length) {
        formData.append('pricingDetails', JSON.stringify(payload.pricingDetails));
      }
      if (payload.shareDetails?.length) {
        formData.append('shareDetails', JSON.stringify(payload.shareDetails));
      }
      if (payload.maintenanceTemplates?.length) {
        formData.append('maintenanceTemplates', JSON.stringify(payload.maintenanceTemplates));
      }

      // File uploads
      if (payload.propertyImages?.length) {
        payload.propertyImages.forEach((file) => formData.append('propertyImages', file));
      }
      if (payload.propertyVideos?.length) {
        payload.propertyVideos.forEach((file) => formData.append('propertyVideos', file));
      }
      if (payload.amenityIcons?.length) {
        payload.amenityIcons.forEach((file) => formData.append('amenityIcons', file));
      }
      if (payload.documents?.length) {
        payload.documents.forEach((file) => formData.append('documents', file));
      }

      const { data } = await api.patch<PropertyResponse>(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (err: any) {
      if (err?.isPermissionError || err?.response?.status === 403) {
        const permissionError: any = new Error(
          err?.message || 'You do not have sufficient permissions.',
        );
        permissionError.isPermissionError = true;
        permissionError.status = 403;
        throw permissionError;
      }

      const serverMessage = err?.response?.data?.message;
      const status = err?.response?.status;
      const errors = err?.response?.data?.errors;

      let message = serverMessage || err?.message || 'Failed to update property';

      if (errors && typeof errors === 'object') {
        const errorList = Object.entries(errors)
          .map(([field, messages]: any) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          })
          .join('\n');
        message = `Validation Errors:\n${errorList}`;
      }

      const error: any = new Error(message);
      error.status = status;
      error.errors = errors;
      throw error;
    }
  },
};
