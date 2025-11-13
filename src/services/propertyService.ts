// src/services/propertyService.ts
import { api } from '@/lib/api';

export interface PropertyResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    location: string;
    totalShares: number;
    availableShares: number;
    pricePerShare: number;
    images: string[];
    amenities: any[];
    documents: string[];
  };
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
          err?.message || 'You do not have sufficient permissions.'
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
};
