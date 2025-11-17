import { useEffect, useState, useMemo, useReducer } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { propertySchema, type PropertyFormValues } from '../validations/property.validation';
import { propertyService, UpdatePropertyPayload } from '../services/propertyService';

const IMAGE_MAX = 20;
const VIDEO_MAX = 5;
const DOC_MAX = 10;
const ICON_MAX = 20;

export const usePropertyForm = (routerParam?: any, propertyId?: string) => {
  const router = routerParam || useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [imageIdsToDelete, setImageIdsToDelete] = useState<string[]>([]);
  const [amenityIdsToDelete, setAmenityIdsToDelete] = useState<string[]>([]);
  const [documentIdsToDelete, setDocumentIdsToDelete] = useState<string[]>([]);
  const [pricingIdsToDelete, setPricingIdsToDelete] = useState<string[]>([]);
  const [shareDetailIdsToDelete, setShareDetailIdsToDelete] = useState<string[]>([]);
  const [maintenanceTemplateIdsToDelete, setMaintenanceTemplateIdsToDelete] = useState<string[]>(
    [],
  );

  // File states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [iconFiles, setIconFiles] = useState<File[]>([]);

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [existingAmenities, setExistingAmenities] = useState<any[]>([]);

  const typedResolver = zodResolver(propertySchema) as unknown as Resolver<PropertyFormValues>;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: typedResolver,
    mode: 'onChange',
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

  const nameValue = watch('name');

  useEffect(() => {
    console.log(JSON.stringify({
      type: 'name_change',
      value: nameValue,
      error: errors.name?.message || null
    }, null, 2));
  }, [nameValue]);

  const sanitizeErrors = (errors: any) => {
    return Object.fromEntries(
      Object.entries(errors).map(([key, err]: [string, any]) => [
        key,
        {
          type: err.type,
          message: err.message,
          ref: err.ref?.name
        }
      ])
    );
  };

  const errorsJson = JSON.stringify(sanitizeErrors(errors));

  useEffect(() => {
    console.log(JSON.stringify({
      type: 'errors_update',
      errors: sanitizeErrors(errors)
    }, null, 2));
  }, [errorsJson]);

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormErrors(sanitizeErrors(errors));
  }, [errorsJson]);

  const [, forceUpdate] = useReducer(x => x + 1, 0);

  useEffect(() => {
    console.log('forceUpdate called');
    forceUpdate();
  }, [errorsJson]);

  // File upload handlers
  const onImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - imageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...imageFiles, ...toAdd];
    setImageFiles(next);
    setValue('propertyImages', [...getValues('propertyImages'), ...toAdd.map((f) => f.name)], { shouldValidate: true });
    setValue('imageFiles', next, { shouldValidate: true });
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
    ], { shouldValidate: true });
    setValue('videoFiles', next, { shouldValidate: true });
  };

  const onDocumentsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, DOC_MAX - documentFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...documentFiles, ...toAdd];
    setDocumentFiles(next);
    setValue('documents', [...(getValues('documents') || []), ...toAdd.map((f) => f.name)], { shouldValidate: true });
    setValue('documentFiles', next, { shouldValidate: true });
  };

  const onIconsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, ICON_MAX - iconFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...iconFiles, ...toAdd];
    setIconFiles(next);
    setValue('amenityIcons', [...(getValues('amenityIcons') || []), ...toAdd.map((f) => f.name)], { shouldValidate: true });
    setValue('iconFiles', next, { shouldValidate: true });
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
    setValue(formKey, newNames, { shouldValidate: true });

    // Also update the file objects in form state
    if (formKey === 'propertyImages') {
      setValue('imageFiles', newFiles, { shouldValidate: true });
    } else if (formKey === 'propertyVideos') {
      setValue('videoFiles', newFiles, { shouldValidate: true });
    } else if (formKey === 'documents') {
      setValue('documentFiles', newFiles, { shouldValidate: true });
    } else if (formKey === 'amenityIcons') {
      setValue('iconFiles', newFiles, { shouldValidate: true });
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

  const removeExistingImage = (id: string) => {
    setImageIdsToDelete((prev) => [...prev, id]);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeExistingVideo = (id: string) => {
    setExistingImages((prev) => [...prev, id]); // Videos are in images table
    setExistingVideos((prev) => prev.filter((vid) => vid.id !== id));
  };

  const removeExistingDocument = (id: string) => {
    setDocumentIdsToDelete((prev) => [...prev, id]);
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const removeExistingAmenity = (id: string) => {
    setAmenityIdsToDelete((prev) => [...prev, id]);
    setExistingAmenities((prev) => prev.filter((amenity) => amenity.id !== id));
  };

  const removeExistingPricing = (id: string) => {
    setPricingIdsToDelete((prev) => [...prev, id]);
    const currentPricingDetails = getValues('pricingDetails') || [];
    setValue(
      'pricingDetails',
      currentPricingDetails.filter((p: any) => p.id !== id),
    );
  };

  const removeExistingShareDetail = (id: string) => {
    setShareDetailIdsToDelete((prev) => [...prev, id]);
    const currentShareDetails = getValues('shareDetails') || [];
    setValue(
      'shareDetails',
      currentShareDetails.filter((s: any) => s.id !== id),
    );
  };

  const removeExistingMaintenanceTemplate = (id: string) => {
    setMaintenanceTemplateIdsToDelete((prev) => [...prev, id]);
    const currentTemplates = getValues('maintenanceTemplates') || [];
    setValue(
      'maintenanceTemplates',
      currentTemplates.filter((t: any) => t.id !== id),
    );
  };

  // Mutations for create and update
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      return await propertyService.createProperty(payload);
    },
    onSuccess: (response) => {
      setSubmitSuccess(response.message || 'Property created successfully!');
      toast.success('Property created successfully!');
      setTimeout(() => {
        router.push('/properties');
      }, 1500);
    },
    onError: (error: any) => {
      const message =
        error?.message || 'Failed to create property. Please try again.';
      setSubmitError(message);
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdatePropertyPayload }) => {
      return await propertyService.updateProperty(id, payload);
    },
    onSuccess: (response) => {
      setSubmitSuccess(response.message || 'Property updated successfully!');
      toast.success('Property updated successfully!');
      setTimeout(() => {
        router.push('/properties');
      }, 1500);
    },
    onError: (error: any) => {
      const message =
        error?.message || 'Failed to update property. Please try again.';
      setSubmitError(message);
      toast.error(message);
    },
  });

  // Load property data for edit mode
  useEffect(() => {
    if (propertyId) {
      setIsLoadingInitial(true);
      propertyService
        .getPropertyById(propertyId)
        .then((response) => {
          const property = response.data;
          setInitialData(property);

          // Set basic fields
          reset({
            name: property.name,
            location: property.location,
            description: property.description || '',
            totalShares: property.totalShares,
            availableShares: property.availableShares,
            pricePerShare: property.pricePerShare,
            appreciationRate: property.appreciationRate || 0,
            maxBookingDays: property.maxBookingDays || 0,
            isActive: property.isActive,
            isFeatured: property.isFeatured,
            amenityNames: property.amenities?.map((a: any) => a.name).join(', ') || '',
            documentNames: property.documents?.map((d: any) => d.name).join(', ') || '',
            propertyImages: [],
            propertyVideos: [],
            amenityIcons: [],
            documents: [],
            imageFiles: [],
            videoFiles: [],
            documentFiles: [],
            iconFiles: [],
            pricingDetails: property.pricings || [],
            shareDetails: property.shareDetails || [],
            maintenanceTemplates: property.maintenanceTemplates || [],
          });

          // Set existing media
          const images = property.images?.filter((img: any) => img.type === 'image') || [];
          const videos = property.images?.filter((img: any) => img.type === 'video') || [];
          setExistingImages(images);
          setExistingVideos(videos);
          setExistingDocuments(property.documents || []);
          setExistingAmenities(property.amenities || []);

          // Trigger currency input re-render by triggering blur event
          setTimeout(() => {
            const priceInput = document.getElementById('pricePerShare') as HTMLInputElement;
            if (priceInput) {
              priceInput.dispatchEvent(new Event('blur', { bubbles: true }));
            }
          }, 100);

          setIsLoadingInitial(false);
        })
        .catch((err) => {
          setSubmitError(err?.message || 'Failed to load property');
          setIsLoadingInitial(false);
        });
    }
  }, [propertyId, reset]);

  const onSubmit = (data: PropertyFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    const processedPricingDetails = (data.pricingDetails || []).map((pricing: any) => ({
      id: pricing.id, // Include ID if exists
      label: pricing.label,
      price: Number(pricing.price),
      type: pricing.type,
      phaseName: pricing.phaseName || undefined,
      description: pricing.description || undefined,
      effectiveFrom: convertToISO(pricing.effectiveFrom),
      effectiveTo: convertToISO(pricing.effectiveTo),
    }));

    const processedShareDetails = (data.shareDetails || []).map((detail: any) => ({
      id: detail.id, // Include ID if exists
      title: detail.title,
      description: detail.description || undefined,
      shareCount: detail.shareCount ? Number(detail.shareCount) : undefined,
      amount: detail.amount ? Number(detail.amount) : undefined,
    }));

    const processedMaintenanceTemplates = (data.maintenanceTemplates || []).map(
      (template: any) => ({
        id: template.id, // Include ID if exists
        chargeType: template.chargeType,
        amount: Number(template.amount),
        description: template.description || undefined,
        dueDay: template.dueDay ? Number(template.dueDay) : undefined,
        startDate: convertToISO(template.startDate),
        endDate: convertToISO(template.endDate),
        isActive: template.isActive ?? true,
      }),
    );

    if (propertyId) {
      // UPDATE MODE
      const payload: UpdatePropertyPayload = {
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
        imageIdsToDelete: imageIdsToDelete.length > 0 ? imageIdsToDelete : undefined,
        amenityIdsToDelete: amenityIdsToDelete.length > 0 ? amenityIdsToDelete : undefined,
        documentIdsToDelete: documentIdsToDelete.length > 0 ? documentIdsToDelete : undefined,
        pricingIdsToDelete: pricingIdsToDelete.length > 0 ? pricingIdsToDelete : undefined,
        shareDetailIdsToDelete:
          shareDetailIdsToDelete.length > 0 ? shareDetailIdsToDelete : undefined,
        maintenanceTemplateIdsToDelete:
          maintenanceTemplateIdsToDelete.length > 0 ? maintenanceTemplateIdsToDelete : undefined,
        propertyImages: imageFiles.length > 0 ? imageFiles : undefined,
        propertyVideos: videoFiles.length > 0 ? videoFiles : undefined,
        amenityIcons: iconFiles.length > 0 ? iconFiles : undefined,
        documents: documentFiles.length > 0 ? documentFiles : undefined,
        pricingDetails: processedPricingDetails.length > 0 ? processedPricingDetails : undefined,
        shareDetails: processedShareDetails.length > 0 ? processedShareDetails : undefined,
        maintenanceTemplates:
          processedMaintenanceTemplates.length > 0 ? processedMaintenanceTemplates : undefined,
      };

      updateMutation.mutate({ id: propertyId, payload });
    } else {
      // CREATE MODE
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

      createMutation.mutate(payload);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    errors: formErrors,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
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
    isLoading: isLoadingInitial,
    existingImages,
    existingVideos,
    existingDocuments,
    existingAmenities,
    removeExistingImage,
    removeExistingVideo,
    removeExistingDocument,
    removeExistingAmenity,
    removeExistingPricing,
    removeExistingShareDetail,
    removeExistingMaintenanceTemplate,
    isEditMode: !!propertyId,
  };
};
