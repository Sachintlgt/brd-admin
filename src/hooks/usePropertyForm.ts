// src/hooks/usePropertyForm.ts (Refactored to use new mutations)
import { useEffect, useState, useReducer } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { propertySchema, type PropertyFormValues } from '../validations/property.validation';
import { usePropertyQuery } from './queries';
import { useCreateProperty, useUpdateProperty } from './mutations';
import { UpdatePropertyPayload } from '@/types/property-list';

const IMAGE_MAX = 20;
const VIDEO_MAX = 5;
const DOC_MAX = 10;
const ICON_MAX = 20;

export const usePropertyForm = (routerParam?: any, propertyId?: string) => {
  const router = routerParam || useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // File states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [iconFiles, setIconFiles] = useState<File[]>([]);
  const [certificateImageFiles, setCertificateImageFiles] = useState<File[]>([]);
  const [floorPlanImageFiles, setFloorPlanImageFiles] = useState<File[]>([]);

  // Deletion tracking
  const [imageIdsToDelete, setImageIdsToDelete] = useState<string[]>([]);
  const [amenityIdsToDelete, setAmenityIdsToDelete] = useState<string[]>([]);
  const [documentIdsToDelete, setDocumentIdsToDelete] = useState<string[]>([]);
  const [pricingIdsToDelete, setPricingIdsToDelete] = useState<string[]>([]);
  const [shareDetailIdsToDelete, setShareDetailIdsToDelete] = useState<string[]>([]);
  const [maintenanceTemplateIdsToDelete, setMaintenanceTemplateIdsToDelete] = useState<string[]>(
    [],
  );
  const [certificateIdsToDelete, setCertificateIdsToDelete] = useState<string[]>([]);
  const [floorPlanIdsToDelete, setFloorPlanIdsToDelete] = useState<string[]>([]);
  const [paymentPlanIdsToDelete, setPaymentPlanIdsToDelete] = useState<string[]>([]);
  const [highlightIdsToDelete, setHighlightIdsToDelete] = useState<string[]>([]);

  // Existing data states
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [existingAmenities, setExistingAmenities] = useState<any[]>([]);
  const [existingCertificates, setExistingCertificates] = useState<any[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<any[]>([]);
  const [existingPricingDetails, setExistingPricingDetails] = useState<any[]>([]);
  const [existingShareDetails, setExistingShareDetails] = useState<any[]>([]);
  const [existingMaintenanceTemplates, setExistingMaintenanceTemplates] = useState<any[]>([]);
  const [existingHighlights, setExistingHighlights] = useState<any[]>([]);
  const [existingPaymentPlans, setExistingPaymentPlans] = useState<any[]>([]);

  // React Hook Form
  const typedResolver = zodResolver(propertySchema) as unknown as Resolver<PropertyFormValues>;

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: typedResolver,
    mode: 'onChange',
    defaultValues: {
      name: '',
      googleLocation: {},
      description: '',
      beds: undefined,
      bathrooms: undefined,
      sqft: undefined,
      maxOccupancy: '',
      totalShares: 0,
      availableShares: 0,
      initialPricePerShare: 0,
      currentPricePerShare: undefined,
      wholeUnitPrice: undefined,
      targetIRR: undefined,
      targetRentalYield: '',
      appreciationRate: 0,
      possessionDate: '',
      launchDate: '',
      maxBookingDays: 0,
      bookingAmount: undefined,
      bookingAmountGST: undefined,
      isActive: true,
      isFeatured: false,
      amenityNames: '',
      documentNames: '',
      propertyImages: [],
      propertyVideos: [],
      amenityIcons: [],
      documents: [],
      certificateImages: [],
      floorPlanImages: [],
      imageFiles: [],
      videoFiles: [],
      documentFiles: [],
      iconFiles: [],
      certificateImageFiles: [],
      floorPlanImageFiles: [],
      pricingDetails: [],
      shareDetails: [],
      maintenanceTemplates: [],
      highlights: [],
      certificates: [],
      floorPlans: [],
      paymentPlans: [],
    },
  });

  // Use new query hook for fetching property
  const { data: propertyData, isLoading: isLoadingProperty } = usePropertyQuery(propertyId, {
    enabled: !!propertyId,
  });

  // Use new mutation hooks
  const createMutation = useCreateProperty({
    onSuccess: (data) => {
      setSubmitSuccess(data.message || 'Property created successfully!');
    },
    onError: (error: any) => {
      setSubmitError(error?.message || 'Failed to create property');
    },
  });

  const updateMutation = useUpdateProperty({
    onSuccess: (data) => {
      setSubmitSuccess(data.message || 'Property updated successfully!');
    },
    onError: (error: any) => {
      setSubmitError(error?.message || 'Failed to update property');
    },
  });

  // Load property data when fetched
  useEffect(() => {
    if (propertyData?.data) {
      const property = propertyData.data;

      // Reset form with property data
      reset({
        name: property.name,
        googleLocation: property.googleLocation,
        description: property.description || '',
        beds: property.beds || undefined,
        bathrooms: property.bathrooms || undefined,
        sqft: property.sqft || undefined,
        maxOccupancy: property.maxOccupancy || '',
        totalShares: property.totalShares,
        availableShares: property.availableShares,
        initialPricePerShare: property.initialPricePerShare || property.pricePerShare || 0,
        currentPricePerShare: property.currentPricePerShare || undefined,
        wholeUnitPrice: property.wholeUnitPrice || undefined,
        targetIRR: property.targetIRR || undefined,
        targetRentalYield: property.targetRentalYield || '',
        appreciationRate: property.appreciationRate || 0,
        possessionDate: convertToDateTimeLocal(property.possessionDate),
        launchDate: convertToDateTimeLocal(property.launchDate),
        maxBookingDays: property.maxBookingDays || 0,
        bookingAmount: property.bookingAmount || undefined,
        bookingAmountGST: property.bookingAmountGST || undefined,
        isActive: property.isActive,
        isFeatured: property.isFeatured,
        amenityNames: property.amenities?.map((a: any) => a.name).join(', ') || '',
        documentNames: property.documents?.map((d: any) => d.name).join(', ') || '',
        propertyImages: [],
        propertyVideos: [],
        amenityIcons: [],
        documents: [],
        certificateImages: [],
        floorPlanImages: [],
        imageFiles: [],
        videoFiles: [],
        documentFiles: [],
        iconFiles: [],
        certificateImageFiles: [],
        floorPlanImageFiles: [],
        pricingDetails: [],
        shareDetails: [],
        maintenanceTemplates: [],
        highlights: [],
        certificates: [],
        floorPlans: [],
        paymentPlans: [],
      });

      // Set existing media
      const images = property.images?.filter((img: any) => img.type === 'image') || [];
      const videos = property.images?.filter((img: any) => img.type === 'video') || [];
      setExistingImages(images);
      setExistingVideos(videos);
      setExistingDocuments(property.documents || []);
      setExistingAmenities(property.amenities || []);
      setExistingCertificates(property.certificates || []);
      setExistingFloorPlans(property.floorPlans || []);

      // Set existing structured data
      const pricings = (property.pricings || []).map((pricing: any) => ({
        ...pricing,
        effectiveFrom: convertToDateTimeLocal(pricing.effectiveFrom),
        effectiveTo: convertToDateTimeLocal(pricing.effectiveTo),
      }));
      setExistingPricingDetails(pricings);

      setExistingShareDetails(property.shareDetails || []);

      const templates = (property.maintenanceTemplates || []).map((template: any) => ({
        ...template,
        startDate: convertToDateTimeLocal(template.startDate),
        endDate: convertToDateTimeLocal(template.endDate),
      }));
      setExistingMaintenanceTemplates(templates);

      setExistingHighlights(property.highlights || []);
      setExistingPaymentPlans(property.paymentPlans || []);
    }
  }, [propertyData, reset]);

  // Dropzone handlers
  const onImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - imageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...imageFiles, ...toAdd];
    setImageFiles(next);
    setValue('imageFiles', next, { shouldValidate: true });
  };

  const onVideosDrop = (accepted: File[]) => {
    const allowed = Math.max(0, VIDEO_MAX - videoFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...videoFiles, ...toAdd];
    setVideoFiles(next);
    setValue('videoFiles', next, { shouldValidate: true });
  };

  const onDocumentsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, DOC_MAX - documentFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...documentFiles, ...toAdd];
    setDocumentFiles(next);
    setValue('documentFiles', next, { shouldValidate: true });
  };

  const onIconsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, ICON_MAX - iconFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...iconFiles, ...toAdd];
    setIconFiles(next);
    setValue('iconFiles', next, { shouldValidate: true });
  };

  const onCertificateImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - certificateImageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...certificateImageFiles, ...toAdd];
    setCertificateImageFiles(next);
    setValue('certificateImageFiles', next, { shouldValidate: true });
  };

  const onFloorPlanImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - floorPlanImageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...floorPlanImageFiles, ...toAdd];
    setFloorPlanImageFiles(next);
    setValue('floorPlanImageFiles', next, { shouldValidate: true });
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
      'image/*': [],
    },
    multiple: true,
  });
  const iconDropzone = useDropzone({
    onDrop: onIconsDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });
  const certificateImageDropzone = useDropzone({
    onDrop: onCertificateImagesDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });
  const floorPlanImageDropzone = useDropzone({
    onDrop: onFloorPlanImagesDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  // Remove handlers
  const removeAt = (
    idx: number,
    files: File[],
    setFiles: (f: File[]) => void,
    formKey: keyof PropertyFormValues,
  ) => {
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);

    if (formKey === 'imageFiles') setValue('imageFiles', newFiles, { shouldValidate: true });
    else if (formKey === 'videoFiles') setValue('videoFiles', newFiles, { shouldValidate: true });
    else if (formKey === 'documentFiles')
      setValue('documentFiles', newFiles, { shouldValidate: true });
    else if (formKey === 'iconFiles') setValue('iconFiles', newFiles, { shouldValidate: true });
    else if (formKey === 'certificateImageFiles')
      setValue('certificateImageFiles', newFiles, { shouldValidate: true });
    else if (formKey === 'floorPlanImageFiles')
      setValue('floorPlanImageFiles', newFiles, { shouldValidate: true });
  };

  const removeExistingImage = (id: string) => {
    setImageIdsToDelete((prev) => [...prev, id]);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeExistingVideo = (id: string) => {
    setImageIdsToDelete((prev) => [...prev, id]);
    setExistingVideos((prev) => prev.filter((vid) => vid.id !== id));
  };

  const removeExistingDocument = (id: string) => {
    setDocumentIdsToDelete((prev) => [...prev, id]);
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const removeExistingAmenity = (id: string) => {
    setAmenityIdsToDelete((prev) => [...prev, id]);
    setExistingAmenities((prev) => prev.filter((a) => a.id !== id));
  };

  const removeExistingPricing = (id: string) => {
    setPricingIdsToDelete((prev) => [...prev, id]);
    setExistingPricingDetails((prev) => prev.filter((p) => p.id !== id));
  };

  const removeExistingShareDetail = (id: string) => {
    setShareDetailIdsToDelete((prev) => [...prev, id]);
    setExistingShareDetails((prev) => prev.filter((s) => s.id !== id));
  };

  const removeExistingMaintenanceTemplate = (id: string) => {
    setMaintenanceTemplateIdsToDelete((prev) => [...prev, id]);
    setExistingMaintenanceTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const removeExistingCertificate = (id: string) => {
    setCertificateIdsToDelete((prev) => [...prev, id]);
    setExistingCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  const removeExistingFloorPlan = (id: string) => {
    setFloorPlanIdsToDelete((prev) => [...prev, id]);
    setExistingFloorPlans((prev) => prev.filter((f) => f.id !== id));
  };

  const removeExistingPaymentPlan = (id: string) => {
    setPaymentPlanIdsToDelete((prev) => [...prev, id]);
    setExistingPaymentPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const removeExistingHighlight = (id: string) => {
    setHighlightIdsToDelete((prev) => [...prev, id]);
    setExistingHighlights((prev) => prev.filter((h) => h.id !== id));
  };

  // Submit handler
  const onSubmit = (data: PropertyFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);

    // Combine existing and new data
    const processedPricingDetails = [
      ...existingPricingDetails.filter((p) => !pricingIdsToDelete.includes(p.id)),
      ...(data.pricingDetails || []).map((p: any) => ({
        ...p,
        effectiveFrom: convertToISO(p.effectiveFrom),
        effectiveTo: convertToISO(p.effectiveTo),
      })),
    ];

    const processedShareDetails = [
      ...existingShareDetails.filter((s) => !shareDetailIdsToDelete.includes(s.id)),
      ...(data.shareDetails || []),
    ];

    const processedMaintenanceTemplates = [
      ...existingMaintenanceTemplates.filter((t) => !maintenanceTemplateIdsToDelete.includes(t.id)),
      ...(data.maintenanceTemplates || []).map((t: any) => ({
        ...t,
        startDate: convertToISO(t.startDate),
        endDate: convertToISO(t.endDate),
      })),
    ];

    if (propertyId) {
      // UPDATE
      const payload: UpdatePropertyPayload = {
        name: data.name,
        googleLocation: data.googleLocation,
        description: data.description || undefined,
        beds: data.beds,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        maxOccupancy: data.maxOccupancy,
        totalShares: data.totalShares,
        availableShares: data.availableShares,
        initialPricePerShare: data.initialPricePerShare,
        currentPricePerShare: data.currentPricePerShare,
        wholeUnitPrice: data.wholeUnitPrice,
        targetIRR: data.targetIRR,
        targetRentalYield: data.targetRentalYield,
        appreciationRate: data.appreciationRate,
        possessionDate: convertToISO(data.possessionDate),
        launchDate: convertToISO(data.launchDate),
        maxBookingDays: data.maxBookingDays,
        bookingAmount: data.bookingAmount,
        bookingAmountGST: data.bookingAmountGST,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        amenityNames: iconFiles.length > 0 ? data.amenityNames : undefined,
        documentNames: documentFiles.length > 0 ? data.documentNames : undefined,
        imageIdsToDelete: imageIdsToDelete.length > 0 ? imageIdsToDelete : undefined,
        amenityIdsToDelete: amenityIdsToDelete.length > 0 ? amenityIdsToDelete : undefined,
        documentIdsToDelete: documentIdsToDelete.length > 0 ? documentIdsToDelete : undefined,
        pricingIdsToDelete: pricingIdsToDelete.length > 0 ? pricingIdsToDelete : undefined,
        shareDetailIdsToDelete:
          shareDetailIdsToDelete.length > 0 ? shareDetailIdsToDelete : undefined,
        maintenanceTemplateIdsToDelete:
          maintenanceTemplateIdsToDelete.length > 0 ? maintenanceTemplateIdsToDelete : undefined,
        certificateIdsToDelete:
          certificateIdsToDelete.length > 0 ? certificateIdsToDelete : undefined,
        floorPlanIdsToDelete: floorPlanIdsToDelete.length > 0 ? floorPlanIdsToDelete : undefined,
        paymentPlanIdsToDelete:
          paymentPlanIdsToDelete.length > 0 ? paymentPlanIdsToDelete : undefined,
        highlightIdsToDelete: highlightIdsToDelete.length > 0 ? highlightIdsToDelete : undefined,
        propertyImages: imageFiles.length > 0 ? imageFiles : undefined,
        propertyVideos: videoFiles.length > 0 ? videoFiles : undefined,
        amenityIcons: iconFiles.length > 0 ? iconFiles : undefined,
        documents: documentFiles.length > 0 ? documentFiles : undefined,
        certificateImages: certificateImageFiles.length > 0 ? certificateImageFiles : undefined,
        floorPlanImages: floorPlanImageFiles.length > 0 ? floorPlanImageFiles : undefined,
        pricingDetails: processedPricingDetails.length > 0 ? processedPricingDetails : undefined,
        shareDetails: processedShareDetails.length > 0 ? processedShareDetails : undefined,
        maintenanceTemplates:
          processedMaintenanceTemplates.length > 0 ? processedMaintenanceTemplates : undefined,
        highlights:
          [
            ...existingHighlights.filter((h) => !highlightIdsToDelete.includes(h.id)),
            ...(data.highlights || []),
          ].length > 0
            ? [
                ...existingHighlights.filter((h) => !highlightIdsToDelete.includes(h.id)),
                ...(data.highlights || []),
              ]
            : undefined,
        certificates:
          [
            ...existingCertificates.filter((c) => !certificateIdsToDelete.includes(c.id)),
            ...(data.certificates || []),
          ].length > 0
            ? [
                ...existingCertificates.filter((c) => !certificateIdsToDelete.includes(c.id)),
                ...(data.certificates || []),
              ]
            : undefined,
        floorPlans:
          [
            ...existingFloorPlans.filter((f) => !floorPlanIdsToDelete.includes(f.id)),
            ...(data.floorPlans || []),
          ].length > 0
            ? [
                ...existingFloorPlans.filter((f) => !floorPlanIdsToDelete.includes(f.id)),
                ...(data.floorPlans || []),
              ]
            : undefined,
        paymentPlans:
          [
            ...existingPaymentPlans.filter((p) => !paymentPlanIdsToDelete.includes(p.id)),
            ...(data.paymentPlans || []),
          ].length > 0
            ? [
                ...existingPaymentPlans.filter((p) => !paymentPlanIdsToDelete.includes(p.id)),
                ...(data.paymentPlans || []),
              ]
            : undefined,
      };

      updateMutation.mutate({ id: propertyId, payload });
    } else {
      // CREATE
      const payload = {
        name: data.name,
        googleLocation: data.googleLocation,
        description: data.description,
        beds: data.beds,
        bathrooms: data.bathrooms,
        sqft: data.sqft,
        maxOccupancy: data.maxOccupancy,
        totalShares: data.totalShares,
        availableShares: data.availableShares,
        initialPricePerShare: data.initialPricePerShare,
        currentPricePerShare: data.currentPricePerShare,
        wholeUnitPrice: data.wholeUnitPrice,
        targetIRR: data.targetIRR,
        targetRentalYield: data.targetRentalYield,
        appreciationRate: data.appreciationRate,
        possessionDate: convertToISO(data.possessionDate),
        launchDate: convertToISO(data.launchDate),
        maxBookingDays: data.maxBookingDays,
        bookingAmount: data.bookingAmount,
        bookingAmountGST: data.bookingAmountGST,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        amenityNames: data.amenityNames,
        documentNames: data.documentNames,
        propertyImages: imageFiles,
        propertyVideos: videoFiles.length > 0 ? videoFiles : undefined,
        amenityIcons: iconFiles.length > 0 ? iconFiles : undefined,
        documents: documentFiles.length > 0 ? documentFiles : undefined,
        certificateImages: certificateImageFiles.length > 0 ? certificateImageFiles : undefined,
        floorPlanImages: floorPlanImageFiles.length > 0 ? floorPlanImageFiles : undefined,
        pricingDetails: processedPricingDetails.length > 0 ? processedPricingDetails : undefined,
        shareDetails: processedShareDetails.length > 0 ? processedShareDetails : undefined,
        maintenanceTemplates:
          processedMaintenanceTemplates.length > 0 ? processedMaintenanceTemplates : undefined,
        highlights: data.highlights?.length > 0 ? data.highlights : undefined,
        certificates: data.certificates?.length > 0 ? data.certificates : undefined,
        floorPlans: data.floorPlans?.length > 0 ? data.floorPlans : undefined,
        paymentPlans: data.paymentPlans?.length > 0 ? data.paymentPlans : undefined,
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
    errors,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    imageFiles,
    setImageFiles,
    videoFiles,
    setVideoFiles,
    documentFiles,
    setDocumentFiles,
    iconFiles,
    setIconFiles,
    certificateImageFiles,
    setCertificateImageFiles,
    floorPlanImageFiles,
    setFloorPlanImageFiles,
    imageDropzone,
    videoDropzone,
    documentDropzone,
    iconDropzone,
    certificateImageDropzone,
    floorPlanImageDropzone,
    removeAt,
    onSubmit,
    submitError,
    submitSuccess,
    setSubmitError,
    setSubmitSuccess,
    isLoading: isLoadingProperty,
    existingImages,
    existingVideos,
    existingDocuments,
    existingAmenities,
    existingCertificates,
    existingFloorPlans,
    existingPricingDetails,
    existingShareDetails,
    existingMaintenanceTemplates,
    existingHighlights,
    existingPaymentPlans,
    removeExistingImage,
    removeExistingVideo,
    removeExistingDocument,
    removeExistingAmenity,
    removeExistingCertificate,
    removeExistingFloorPlan,
    removeExistingPricing,
    removeExistingShareDetail,
    removeExistingMaintenanceTemplate,
    removeExistingPaymentPlan,
    removeExistingHighlight,
    isEditMode: !!propertyId,
  };
};

// Helper functions
const convertToISO = (dateString?: string) => {
  if (!dateString) return undefined;
  try {
    return new Date(dateString).toISOString();
  } catch {
    return undefined;
  }
};

const convertToDateTimeLocal = (isoString?: string) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return '';
  }
};
