import { useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { propertySchema, type PropertyFormValues } from '../validations/property.validation';
import { propertyService } from '../services/propertyService';

const IMAGE_MAX = 20;
const VIDEO_MAX = 5;
const DOC_MAX = 10;
const ICON_MAX = 20;

export const usePropertyForm = (routerParam?: any) => {
  const router = routerParam || useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const typedResolver = zodResolver(propertySchema) as unknown as Resolver<PropertyFormValues>;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: typedResolver,
    defaultValues: {
      name: '',
      location: '',
      description: '',
      totalShares: 0,
      availableShares: 0,
      pricePerShare: 0,
      appreciationRate: 0,
      maxBookingDays: 0,
      isActive: true,
      isFeatured: false,
      amenityNames: '',
      documentNames: '',
      propertyImages: [],
      propertyVideos: [],
      amenityIcons: [],
      documents: [],
      imageFiles: [],
      videoFiles: [],
      documentFiles: [],
      iconFiles: [],
      pricingDetails: [],
      shareDetails: [],
      maintenanceTemplates: [],
    },
  });

  // File states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [iconFiles, setIconFiles] = useState<File[]>([]);

  // File upload handlers
  const onImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - imageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...imageFiles, ...toAdd];
    setImageFiles(next);
    setValue('propertyImages', [...getValues('propertyImages'), ...toAdd.map((f) => f.name)]);
    setValue('imageFiles', next);
  };

  const onVideosDrop = (accepted: File[]) => {
    const allowed = Math.max(0, VIDEO_MAX - videoFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...videoFiles, ...toAdd];
    setVideoFiles(next);
    setValue('propertyVideos', [
      ...(getValues('propertyVideos') || []),
      ...toAdd.map((f) => f.name),
    ]);
    setValue('videoFiles', next);
  };

  const onDocumentsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, DOC_MAX - documentFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...documentFiles, ...toAdd];
    setDocumentFiles(next);
    setValue('documents', [...(getValues('documents') || []), ...toAdd.map((f) => f.name)]);
    setValue('documentFiles', next);
  };

  const onIconsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, ICON_MAX - iconFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...iconFiles, ...toAdd];
    setIconFiles(next);
    setValue('amenityIcons', [...(getValues('amenityIcons') || []), ...toAdd.map((f) => f.name)]);
    setValue('iconFiles', next);
  };

  // Dropzones
  const imageDropzone = useDropzone({
    onDrop: onImagesDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const videoDropzone = useDropzone({
    onDrop: onVideosDrop,
    accept: { 'video/*': [] },
    multiple: true,
  });

  const documentDropzone = useDropzone({
    onDrop: onDocumentsDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    },
    multiple: true,
  });

  const iconDropzone = useDropzone({
    onDrop: onIconsDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.svg', '.webp'] },
    multiple: true,
  });

  // Remove file handlers
  const removeAt = (
    idx: number,
    files: File[],
    setFiles: (f: File[]) => void,
    formKey: keyof PropertyFormValues,
  ) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    const names = (getValues(formKey) as string[]) || [];
    const newNames = names.filter((_, i) => i !== idx);
    setValue(formKey, newNames);

    // Also update the file objects in form state
    if (formKey === 'propertyImages') {
      setValue('imageFiles', newFiles);
    } else if (formKey === 'propertyVideos') {
      setValue('videoFiles', newFiles);
    } else if (formKey === 'documents') {
      setValue('documentFiles', newFiles);
    } else if (formKey === 'amenityIcons') {
      setValue('iconFiles', newFiles);
    }
  };

  // Helper function to convert datetime-local to ISO format
  const convertToISO = (dateString?: string) => {
    if (!dateString) return undefined;
    try {
      return new Date(dateString).toISOString();
    } catch {
      return undefined;
    }
  };

  const onSubmit = async (data: PropertyFormValues) => {
    try {
      setSubmitError(null);
      setSubmitSuccess(null);

      //  Process pricing details - convert dates to ISO format
      const processedPricingDetails = (data.pricingDetails || []).map((pricing) => ({
        label: pricing.label,
        price: Number(pricing.price),
        type: pricing.type,
        phaseName: pricing.phaseName || undefined,
        description: pricing.description || undefined,
        effectiveFrom: convertToISO(pricing.effectiveFrom),
        effectiveTo: convertToISO(pricing.effectiveTo),
      }));

      //  Process share details - convert string numbers to actual numbers
      const processedShareDetails = (data.shareDetails || []).map((detail) => ({
        title: detail.title,
        description: detail.description || undefined,
        shareCount: detail.shareCount ? Number(detail.shareCount) : undefined,
        amount: detail.amount ? Number(detail.amount) : undefined,
      }));

      //  Process maintenance templates - convert dates and numbers
      const processedMaintenanceTemplates = (data.maintenanceTemplates || []).map((template) => ({
        chargeType: template.chargeType,
        amount: Number(template.amount),
        description: template.description || undefined,
        dueDay: template.dueDay ? Number(template.dueDay) : undefined,
        startDate: convertToISO(template.startDate),
        endDate: convertToISO(template.endDate),
        isActive: template.isActive ?? true,
      }));

      // Prepare payload with actual files
      const payload = {
        name: data.name,
        location: data.location,
        description: data.description || undefined,
        totalShares: data.totalShares,
        availableShares: data.availableShares,
        pricePerShare: data.pricePerShare,
        appreciationRate: data.appreciationRate || undefined,
        maxBookingDays: data.maxBookingDays || undefined,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        amenityNames: data.amenityNames || undefined,
        documentNames: data.documentNames || undefined,
        propertyImages: imageFiles,
        propertyVideos: videoFiles.length > 0 ? videoFiles : undefined,
        amenityIcons: iconFiles.length > 0 ? iconFiles : undefined,
        documents: documentFiles.length > 0 ? documentFiles : undefined,
        pricingDetails: processedPricingDetails.length > 0 ? processedPricingDetails : undefined,
        shareDetails: processedShareDetails.length > 0 ? processedShareDetails : undefined,
        maintenanceTemplates:
          processedMaintenanceTemplates.length > 0 ? processedMaintenanceTemplates : undefined,
      };

      // Call API service
      const response = await propertyService.createProperty(payload);

      if (response.success) {
        setSubmitSuccess(response.message || 'Property created successfully!');
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/properties');
        }, 1500);
      }
    } catch (err: any) {
      if (err?.isPermissionError) {
        setSubmitError(err.message || 'You do not have sufficient permissions.');
        console.error('Permission error:', err);
        return;
      }

      const errorMessage = err?.message || 'Failed to create property. Please try again.';
      setSubmitError(errorMessage);
      console.error('Error adding property:', err);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    getValues,
    errors,
    isSubmitting,
    imageFiles,
    setImageFiles,
    videoFiles,
    setVideoFiles,
    documentFiles,
    setDocumentFiles,
    iconFiles,
    setIconFiles,
    imageDropzone,
    videoDropzone,
    documentDropzone,
    iconDropzone,
    removeAt,
    onSubmit,
    submitError,
    submitSuccess,
    setSubmitError,
    setSubmitSuccess,
  };
};
