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
  locationLat?: number;
  locationLng?: number;
  locationPlaceId?: number;
  streetNumber?: string;
  street?: string;
  city: string;
  state: string;
  stateCode?: string;
  country: string;
  countryCode?: string;
  postalCode: string;
  postalCodeSuffix?: string;
  viewportNortheastLat?: number;
  viewportNortheastLng?: number;
  viewportSouthwestLat?: number;
  viewportSouthwestLng?: number;
  zoom?: number;
  beds?: number;
  bathrooms?: number;
  sqft?: number;
  maxOccupancy?: string;
  totalShares: number;
  availableShares: number;
  initialPricePerShare: number;
  currentPricePerShare?: number;
  wholeUnitPrice?: number;
  targetIRR?: number;
  targetRentalYield?: string;
  appreciationRate?: number;
  possessionDate?: string;
  launchDate?: string;
  maxBookingDays?: number;
  bookingAmount?: number;
  bookingAmountGST?: number;
  isActive: boolean;
  isFeatured: boolean;
  amenityNames?: string;
  documentNames?: string;
  propertyImages: File[];
  propertyVideos?: File[];
  amenityIcons?: File[];
  documents?: File[];
  certificateImages?: File[];
  floorPlanImages?: File[];
  pricingDetails?: any[];
  shareDetails?: any[];
  maintenanceTemplates?: any[];
  certificates?: any[];
  floorPlans?: any[];
  paymentPlans?: any[];
}

export interface UpdatePropertyPayload {
  name?: string;
  location?: string;
  description?: string;
  locationLat?: number;
  locationLng?: number;
  locationPlaceId?: number;
  streetNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  country?: string;
  countryCode?: string;
  postalCode?: string;
  postalCodeSuffix?: string;
  viewportNortheastLat?: number;
  viewportNortheastLng?: number;
  viewportSouthwestLat?: number;
  viewportSouthwestLng?: number;
  zoom?: number;
  beds?: number;
  bathrooms?: number;
  sqft?: number;
  maxOccupancy?: string;
  totalShares?: number;
  availableShares?: number;
  initialPricePerShare?: number;
  currentPricePerShare?: number;
  wholeUnitPrice?: number;
  targetIRR?: number;
  targetRentalYield?: string;
  appreciationRate?: number;
  possessionDate?: string;
  launchDate?: string;
  maxBookingDays?: number;
  bookingAmount?: number;
  bookingAmountGST?: number;
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
  certificateIdsToDelete?: string[];
  floorPlanIdsToDelete?: string[];
  paymentPlanIdsToDelete?: string[];
  propertyImages?: File[];
  propertyVideos?: File[];
  amenityIcons?: File[];
  documents?: File[];
  certificateImages?: File[];
  floorPlanImages?: File[];
  pricingDetails?: any[];
  shareDetails?: any[];
  maintenanceTemplates?: any[];
  certificates?: any[];
  floorPlans?: any[];
  paymentPlans?: any[];
  certificateNames?: string;
  floorPlanNames?: string;
}

export const propertyService = {
  createProperty: async (payload: CreatePropertyPayload): Promise<PropertyResponse> => {
    try {
      const formData = new FormData();

      formData.append('name', payload.name);
      formData.append('location', payload.location);
      if (payload.description) formData.append('description', payload.description);

      // Location fields
      if (payload.locationLat !== undefined)
        formData.append('locationLat', String(payload.locationLat));
      if (payload.locationLng !== undefined)
        formData.append('locationLng', String(payload.locationLng));
      if (payload.locationPlaceId !== undefined)
        formData.append('locationPlaceId', String(payload.locationPlaceId));
      if (payload.streetNumber) formData.append('streetNumber', payload.streetNumber);
      if (payload.street) formData.append('street', payload.street);
      if (payload.city) formData.append('city', payload.city);
      if (payload.state) formData.append('state', payload.state);
      if (payload.stateCode) formData.append('stateCode', payload.stateCode);
      if (payload.country) formData.append('country', payload.country);
      if (payload.countryCode) formData.append('countryCode', payload.countryCode);
      if (payload.postalCode) formData.append('postalCode', payload.postalCode);
      if (payload.postalCodeSuffix) formData.append('postalCodeSuffix', payload.postalCodeSuffix);
      if (payload.viewportNortheastLat !== undefined)
        formData.append('viewportNortheastLat', String(payload.viewportNortheastLat));
      if (payload.viewportNortheastLng !== undefined)
        formData.append('viewportNortheastLng', String(payload.viewportNortheastLng));
      if (payload.viewportSouthwestLat !== undefined)
        formData.append('viewportSouthwestLat', String(payload.viewportSouthwestLat));
      if (payload.viewportSouthwestLng !== undefined)
        formData.append('viewportSouthwestLng', String(payload.viewportSouthwestLng));
      if (payload.zoom !== undefined) formData.append('zoom', String(payload.zoom));

      // Property Details
      if (payload.beds !== undefined) formData.append('beds', String(payload.beds));
      if (payload.bathrooms !== undefined) formData.append('bathrooms', String(payload.bathrooms));
      if (payload.sqft !== undefined) formData.append('sqft', String(payload.sqft));
      if (payload.maxOccupancy) formData.append('maxOccupancy', payload.maxOccupancy);

      formData.append('totalShares', String(payload.totalShares));
      formData.append('availableShares', String(payload.availableShares));
      formData.append('initialPricePerShare', String(payload.initialPricePerShare));
      if (payload.currentPricePerShare !== undefined)
        formData.append('currentPricePerShare', String(payload.currentPricePerShare));
      if (payload.wholeUnitPrice !== undefined)
        formData.append('wholeUnitPrice', String(payload.wholeUnitPrice));

      // Financial Metrics
      if (payload.targetIRR !== undefined) formData.append('targetIRR', String(payload.targetIRR));
      if (payload.targetRentalYield)
        formData.append('targetRentalYield', payload.targetRentalYield);
      if (payload.appreciationRate !== undefined)
        formData.append('appreciationRate', String(payload.appreciationRate));

      // Dates
      if (payload.possessionDate) formData.append('possessionDate', payload.possessionDate);
      if (payload.launchDate) formData.append('launchDate', payload.launchDate);

      if (payload.maxBookingDays !== undefined)
        formData.append('maxBookingDays', String(payload.maxBookingDays));
      if (payload.bookingAmount !== undefined)
        formData.append('bookingAmount', String(payload.bookingAmount));
      if (payload.bookingAmountGST !== undefined)
        formData.append('bookingAmountGST', String(payload.bookingAmountGST));

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
      if (payload.certificateImages?.length) {
        payload.certificateImages.forEach((file) => formData.append('certificateImages', file));
      }
      if (payload.floorPlanImages?.length) {
        payload.floorPlanImages.forEach((file) => formData.append('floorPlanImages', file));
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

      if (payload.certificates?.length) {
        formData.append('certificates', JSON.stringify(payload.certificates));
      }
      if (payload.floorPlans?.length) {
        formData.append('floorPlans', JSON.stringify(payload.floorPlans));
      }
      if (payload.paymentPlans?.length) {
        formData.append('paymentPlans', JSON.stringify(payload.paymentPlans));
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

      // Location fields
      if (payload.locationLat !== undefined)
        formData.append('locationLat', String(payload.locationLat));
      if (payload.locationLng !== undefined)
        formData.append('locationLng', String(payload.locationLng));
      if (payload.locationPlaceId !== undefined)
        formData.append('locationPlaceId', String(payload.locationPlaceId));
      if (payload.streetNumber) formData.append('streetNumber', payload.streetNumber);
      if (payload.street) formData.append('street', payload.street);
      if (payload.city) formData.append('city', payload.city);
      if (payload.state) formData.append('state', payload.state);
      if (payload.stateCode) formData.append('stateCode', payload.stateCode);
      if (payload.country) formData.append('country', payload.country);
      if (payload.countryCode) formData.append('countryCode', payload.countryCode);
      if (payload.postalCode) formData.append('postalCode', payload.postalCode);
      if (payload.postalCodeSuffix) formData.append('postalCodeSuffix', payload.postalCodeSuffix);
      if (payload.viewportNortheastLat !== undefined)
        formData.append('viewportNortheastLat', String(payload.viewportNortheastLat));
      if (payload.viewportNortheastLng !== undefined)
        formData.append('viewportNortheastLng', String(payload.viewportNortheastLng));
      if (payload.viewportSouthwestLat !== undefined)
        formData.append('viewportSouthwestLat', String(payload.viewportSouthwestLat));
      if (payload.viewportSouthwestLng !== undefined)
        formData.append('viewportSouthwestLng', String(payload.viewportSouthwestLng));
      if (payload.zoom !== undefined) formData.append('zoom', String(payload.zoom));

      // Numeric fields
      if (payload.beds !== undefined) formData.append('beds', String(payload.beds));
      if (payload.bathrooms !== undefined) formData.append('bathrooms', String(payload.bathrooms));
      if (payload.sqft !== undefined) formData.append('sqft', String(payload.sqft));
      if (payload.maxOccupancy) formData.append('maxOccupancy', payload.maxOccupancy);

      if (payload.totalShares !== undefined)
        formData.append('totalShares', String(payload.totalShares));
      if (payload.availableShares !== undefined)
        formData.append('availableShares', String(payload.availableShares));
      if (payload.initialPricePerShare !== undefined)
        formData.append('initialPricePerShare', String(payload.initialPricePerShare));
      if (payload.currentPricePerShare !== undefined)
        formData.append('currentPricePerShare', String(payload.currentPricePerShare));
      if (payload.wholeUnitPrice !== undefined)
        formData.append('wholeUnitPrice', String(payload.wholeUnitPrice));

      // Financial Metrics
      if (payload.targetIRR !== undefined) formData.append('targetIRR', String(payload.targetIRR));
      if (payload.targetRentalYield)
        formData.append('targetRentalYield', payload.targetRentalYield);
      if (payload.appreciationRate !== undefined)
        formData.append('appreciationRate', String(payload.appreciationRate));

      // Dates
      if (payload.possessionDate) formData.append('possessionDate', payload.possessionDate);
      if (payload.launchDate) formData.append('launchDate', payload.launchDate);

      if (payload.maxBookingDays !== undefined)
        formData.append('maxBookingDays', String(payload.maxBookingDays));
      if (payload.bookingAmount !== undefined)
        formData.append('bookingAmount', String(payload.bookingAmount));
      if (payload.bookingAmountGST !== undefined)
        formData.append('bookingAmountGST', String(payload.bookingAmountGST));

      // Boolean fields
      if (payload.isActive !== undefined) formData.append('isActive', String(payload.isActive));
      if (payload.isFeatured !== undefined)
        formData.append('isFeatured', String(payload.isFeatured));

      // Text fields
      if (payload.amenityNames) formData.append('amenityNames', payload.amenityNames);
      if (payload.documentNames) formData.append('documentNames', payload.documentNames);

      // Delete IDs arrays (comma-separated UUIDs as per API spec)
      if (payload.imageIdsToDelete?.length) {
        formData.append('imageIdsToDelete', payload.imageIdsToDelete.join(','));
      }
      if (payload.amenityIdsToDelete?.length) {
        formData.append('amenityIdsToDelete', payload.amenityIdsToDelete.join(','));
      }
      if (payload.documentIdsToDelete?.length) {
        formData.append('documentIdsToDelete', payload.documentIdsToDelete.join(','));
      }
      if (payload.pricingIdsToDelete?.length) {
        formData.append('pricingIdsToDelete', payload.pricingIdsToDelete.join(','));
      }
      if (payload.shareDetailIdsToDelete?.length) {
        formData.append('shareDetailIdsToDelete', payload.shareDetailIdsToDelete.join(','));
      }
      if (payload.maintenanceTemplateIdsToDelete?.length) {
        formData.append(
          'maintenanceTemplateIdsToDelete',
          payload.maintenanceTemplateIdsToDelete.join(','),
        );
      }
      if (payload.certificateIdsToDelete?.length) {
        formData.append('certificateIdsToDelete', payload.certificateIdsToDelete.join(','));
      }
      if (payload.floorPlanIdsToDelete?.length) {
        formData.append('floorPlanIdsToDelete', payload.floorPlanIdsToDelete.join(','));
      }
      if (payload.paymentPlanIdsToDelete?.length) {
        formData.append('paymentPlanIdsToDelete', payload.paymentPlanIdsToDelete.join(','));
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

      if (payload.certificates?.length) {
        formData.append('certificates', JSON.stringify(payload.certificates));
      }
      if (payload.floorPlans?.length) {
        formData.append('floorPlans', JSON.stringify(payload.floorPlans));
      }
      if (payload.paymentPlans?.length) {
        formData.append('paymentPlans', JSON.stringify(payload.paymentPlans));
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
      if (payload.certificateImages?.length) {
        payload.certificateImages.forEach((file) => formData.append('certificateImages', file));
      }
      if (payload.floorPlanImages?.length) {
        payload.floorPlanImages.forEach((file) => formData.append('floorPlanImages', file));
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
