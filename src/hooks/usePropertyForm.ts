import { useEffect, useState, useMemo, useReducer } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
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
  const [certificateIdsToDelete, setCertificateIdsToDelete] = useState<string[]>([]);
  const [floorPlanIdsToDelete, setFloorPlanIdsToDelete] = useState<string[]>([]);
  const [paymentPlanIdsToDelete, setPaymentPlanIdsToDelete] = useState<string[]>([]);

  // File states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [iconFiles, setIconFiles] = useState<File[]>([]);
  const [certificateImageFiles, setCertificateImageFiles] = useState<File[]>([]);
  const [floorPlanImageFiles, setFloorPlanImageFiles] = useState<File[]>([]);

  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [existingVideos, setExistingVideos] = useState<any[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<any[]>([]);
  const [existingAmenities, setExistingAmenities] = useState<any[]>([]);
  const [existingCertificates, setExistingCertificates] = useState<any[]>([]);
  const [existingFloorPlans, setExistingFloorPlans] = useState<any[]>([]);
  const [existingPricingDetails, setExistingPricingDetails] = useState<any[]>([]);
  const [existingShareDetails, setExistingShareDetails] = useState<any[]>([]);
  const [existingMaintenanceTemplates, setExistingMaintenanceTemplates] = useState<any[]>([]);
  const [existingPaymentPlans, setExistingPaymentPlans] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      location: '',
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
      certificateNames: '',
      floorPlanNames: '',
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
      certificates: [],
      floorPlans: [],
      paymentPlans: [],
    },
  });

  const sanitizeErrors = (errors: any) => {
    return Object.fromEntries(
      Object.entries(errors).map(([key, err]: [string, any]) => [
        key,
        {
          type: err.type,
          message: err.message,
          ref: err.ref?.name,
        },
      ]),
    );
  };

  const errorsJson = JSON.stringify(sanitizeErrors(errors));

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    setFormErrors(sanitizeErrors(errors));
  }, [errorsJson]);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    forceUpdate();
  }, [errorsJson]);

  // File upload handlers
  const onImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - imageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...imageFiles, ...toAdd];
    setImageFiles(next);
    setValue(
      'propertyImages',
      [...(getValues('propertyImages') || []), ...toAdd.map((f) => f.name)],
      { shouldValidate: true },
    );
    setValue('imageFiles', next, { shouldValidate: true });
  };

  const onVideosDrop = (accepted: File[]) => {
    const allowed = Math.max(0, VIDEO_MAX - videoFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...videoFiles, ...toAdd];
    setVideoFiles(next);
    setValue(
      'propertyVideos',
      [...(getValues('propertyVideos') || []), ...toAdd.map((f) => f.name)],
      { shouldValidate: true },
    );
    setValue('videoFiles', next, { shouldValidate: true });
  };

  const onDocumentsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, DOC_MAX - documentFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...documentFiles, ...toAdd];
    setDocumentFiles(next);
    setValue('documents', [...(getValues('documents') || []), ...toAdd.map((f) => f.name)], {
      shouldValidate: true,
    });
    setValue('documentFiles', next, { shouldValidate: true });
  };

  const onIconsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, ICON_MAX - iconFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...iconFiles, ...toAdd];
    setIconFiles(next);
    setValue('amenityIcons', [...(getValues('amenityIcons') || []), ...toAdd.map((f) => f.name)], {
      shouldValidate: true,
    });
    setValue('iconFiles', next, { shouldValidate: true });
  };

  const onCertificateImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - certificateImageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...certificateImageFiles, ...toAdd];
    setCertificateImageFiles(next);
    setValue(
      'certificateImages',
      [...(getValues('certificateImages') || []), ...toAdd.map((f) => f.name)],
      { shouldValidate: true },
    );
    setValue('certificateImageFiles', next, { shouldValidate: true });
  };

  const onFloorPlanImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - floorPlanImageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...floorPlanImageFiles, ...toAdd];
    setFloorPlanImageFiles(next);
    setValue(
      'floorPlanImages',
      [...(getValues('floorPlanImages') || []), ...toAdd.map((f) => f.name)],
      { shouldValidate: true },
    );
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
    } else if (formKey === 'certificateImages') {
      setValue('certificateImageFiles', newFiles, { shouldValidate: true });
    } else if (formKey === 'floorPlanImages') {
      setValue('floorPlanImageFiles', newFiles, { shouldValidate: true });
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

  // Helper function to convert ISO date to datetime-local format (YYYY-MM-DDTHH:MM)
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

  const removeExistingImage = (id: string) => {
    setImageIdsToDelete((prev) => [...prev, id]);
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  const removeExistingVideo = (id: string) => {
    setExistingImages((prev) => [...prev, id]); // Videos are in images table
    setExistingVideos((prev) => prev.filter((vid) => vid.id !== id));
  };

  const removeExistingDocument = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setDocumentIdsToDelete((prev) => [...prev, id]);
      setExistingDocuments((prev) => prev.filter((doc) => doc.id !== id));
    }, 0);
  };

  const removeExistingAmenity = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setAmenityIdsToDelete((prev) => [...prev, id]);
      setExistingAmenities((prev) => prev.filter((amenity) => amenity.id !== id));
    }, 0);
  };

  const removeExistingPricing = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setPricingIdsToDelete((prev) => [...prev, id]);
      setExistingPricingDetails((prev) => prev.filter((pricing) => pricing.id !== id));
      const currentPricingDetails = getValues('pricingDetails') || [];
      setValue(
        'pricingDetails',
        currentPricingDetails.filter((p: any) => p.id !== id),
      );
    }, 0);
  };

  const removeExistingShareDetail = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setShareDetailIdsToDelete((prev) => [...prev, id]);
      setExistingShareDetails((prev) => prev.filter((share) => share.id !== id));
      const currentShareDetails = getValues('shareDetails') || [];
      setValue(
        'shareDetails',
        currentShareDetails.filter((s: any) => s.id !== id),
      );
    }, 0);
  };

  const removeExistingMaintenanceTemplate = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setMaintenanceTemplateIdsToDelete((prev) => [...prev, id]);
      setExistingMaintenanceTemplates((prev) => prev.filter((template) => template.id !== id));
      const currentTemplates = getValues('maintenanceTemplates') || [];
      setValue(
        'maintenanceTemplates',
        currentTemplates.filter((t: any) => t.id !== id),
      );
    }, 0);
  };

  const removeExistingCertificate = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setCertificateIdsToDelete((prev) => [...prev, id]);
      setExistingCertificates((prev) => prev.filter((cert) => cert.id !== id));
    }, 0);
  };

  const removeExistingFloorPlan = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setFloorPlanIdsToDelete((prev) => [...prev, id]);
      setExistingFloorPlans((prev) => prev.filter((plan) => plan.id !== id));
    }, 0);
  };

  const removeExistingPaymentPlan = (id: string) => {
    // Defer state updates to avoid calling setState during render
    setTimeout(() => {
      setPaymentPlanIdsToDelete((prev) => [...prev, id]);
      const currentPaymentPlans = getValues('paymentPlans') || [];
      setValue(
        'paymentPlans',
        currentPaymentPlans.filter((p: any) => p.id !== id),
      );
      setExistingPaymentPlans((prev) => prev.filter((plan) => plan.id !== id));
    }, 0);
  };

  // Load property data for edit mode
  useEffect(() => {
    if (propertyId) {
      setIsLoadingInitial(true);
      propertyService
        .getPropertyById(propertyId)
        .then((response) => {
          const property = response.data;
          setInitialData(property);

          // Prepare form array data
          const pricings = (property.pricings || property.pricingDetails || []).map(
            (pricing: any) => ({
              ...pricing,
              effectiveFrom: convertToDateTimeLocal(pricing.effectiveFrom),
              effectiveTo: convertToDateTimeLocal(pricing.effectiveTo),
            }),
          );

          const shares = property.shareDetails || [];

          const templates = (property.maintenanceTemplates || []).map((template: any) => ({
            ...template,
            startDate: convertToDateTimeLocal(template.startDate),
            endDate: convertToDateTimeLocal(template.endDate),
          }));

          const paymentPlans = property.paymentPlans || [];

          // Set basic fields and form arrays together
          reset({
            name: property.name,
            location: property.location,
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
            certificateNames: property.certificates?.map((c: any) => c.name).join(', ') || '',
            floorPlanNames: property.floorPlans?.map((f: any) => f.name).join(', ') || '',
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
            pricingDetails: pricings,
            shareDetails: shares,
            maintenanceTemplates: templates,
            certificates: [],
            floorPlans: [],
            paymentPlans: paymentPlans,
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

          // Set existing data for state management (for deletion tracking)
          setExistingPricingDetails(pricings);
          setExistingShareDetails(shares);
          setExistingMaintenanceTemplates(templates);
          setExistingPaymentPlans(paymentPlans);

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

  const onSubmit = async (data: PropertyFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      // Process pricing details - all items come from form now (existing + new)
      const processedPricingDetails = (data.pricingDetails || []).map((pricing: any) => ({
        id: pricing.id, // Include ID if exists (for existing records)
        label: pricing.label,
        price: Number(pricing.price),
        type: pricing.type,
        phaseName: pricing.phaseName || undefined,
        description: pricing.description || undefined,
        effectiveFrom: convertToISO(pricing.effectiveFrom),
        effectiveTo: convertToISO(pricing.effectiveTo),
      }));

      // Find deleted pricing details (existing ones not in the form)
      const currentPricingIds = processedPricingDetails.filter((p) => p.id).map((p) => p.id);
      const deletedPricingIds = existingPricingDetails
        .filter((p) => !currentPricingIds.includes(p.id))
        .map((p) => p.id);
      deletedPricingIds.forEach((id) => setPricingIdsToDelete((prev) => [...prev, id]));

      // Process share details - all items come from form now (existing + new)
      const processedShareDetails = (data.shareDetails || []).map((detail: any) => ({
        id: detail.id, // Include ID if exists
        title: detail.title,
        description: detail.description || undefined,
        shareCount: detail.shareCount ? Number(detail.shareCount) : undefined,
        amount: detail.amount ? Number(detail.amount) : undefined,
      }));

      // Find deleted share details (existing ones not in the form)
      const currentShareIds = processedShareDetails.filter((s) => s.id).map((s) => s.id);
      const deletedShareIds = existingShareDetails
        .filter((s) => !currentShareIds.includes(s.id))
        .map((s) => s.id);
      deletedShareIds.forEach((id) => setShareDetailIdsToDelete((prev) => [...prev, id]));

      // Process maintenance templates - all items come from form now (existing + new)
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

      // Find deleted maintenance templates (existing ones not in the form)
      const currentTemplateIds = processedMaintenanceTemplates.filter((t) => t.id).map((t) => t.id);
      const deletedTemplateIds = existingMaintenanceTemplates
        .filter((t) => !currentTemplateIds.includes(t.id))
        .map((t) => t.id);
      deletedTemplateIds.forEach((id) =>
        setMaintenanceTemplateIdsToDelete((prev) => [...prev, id]),
      );

      // Process payment plans
      const processedPaymentPlans = (data.paymentPlans || []).map((plan: any) => ({
        id: plan.id, // Include ID if exists
        planType: plan.planType,
        purchaseType: plan.purchaseType,
        name: plan.name,
        description: plan.description || undefined,
        amount: plan.amount ? Number(plan.amount) : undefined,
        percentage: plan.percentage ? Number(plan.percentage) : undefined,
        milestone: plan.milestone || undefined,
        dueDate: plan.dueDate || undefined,
        displayOrder: plan.displayOrder || 0,
        isGSTIncluded: plan.isGSTIncluded ?? false,
        gstPercentage: plan.gstPercentage ? Number(plan.gstPercentage) : undefined,
      }));

      // Find deleted payment plans (existing ones not in the form)
      const currentPaymentPlanIds = processedPaymentPlans.filter((p) => p.id).map((p) => p.id);
      const deletedPaymentPlanIds = existingPaymentPlans
        .filter((p) => !currentPaymentPlanIds.includes(p.id))
        .map((p) => p.id);
      deletedPaymentPlanIds.forEach((id) => setPaymentPlanIdsToDelete((prev) => [...prev, id]));

      if (propertyId) {
        // UPDATE MODE
        const payload: UpdatePropertyPayload = {
          name: data.name,
          location: data.location,
          description: data.description || undefined,
          googleLocation: data.googleLocation,
          beds: data.beds || undefined,
          bathrooms: data.bathrooms || undefined,
          sqft: data.sqft || undefined,
          maxOccupancy: data.maxOccupancy || undefined,
          totalShares: data.totalShares,
          availableShares: data.availableShares,
          initialPricePerShare: data.initialPricePerShare,
          currentPricePerShare: data.currentPricePerShare || undefined,
          wholeUnitPrice: data.wholeUnitPrice || undefined,
          targetIRR: data.targetIRR || undefined,
          targetRentalYield: data.targetRentalYield || undefined,
          appreciationRate: data.appreciationRate || undefined,
          possessionDate: convertToISO(data.possessionDate) || undefined,
          launchDate: convertToISO(data.launchDate) || undefined,
          maxBookingDays: data.maxBookingDays || undefined,
          bookingAmount: data.bookingAmount || undefined,
          bookingAmountGST: data.bookingAmountGST || undefined,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          amenityNames: iconFiles.length > 0 ? data.amenityNames : undefined,
          documentNames: documentFiles.length > 0 ? data.documentNames : undefined,
          certificateNames: certificateImageFiles.length > 0 ? data.certificateNames : undefined,
          floorPlanNames: floorPlanImageFiles.length > 0 ? data.floorPlanNames : undefined,
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
          paymentPlans: processedPaymentPlans.length > 0 ? processedPaymentPlans : undefined,
          certificates: data.certificates?.length ? data.certificates : undefined,
          floorPlans: data.floorPlans?.length ? data.floorPlans : undefined,
        };

        const response = await propertyService.updateProperty(propertyId, payload);

        setSubmitSuccess(response.message || 'Property updated successfully!');
        toast.success('Property updated successfully!');

        setTimeout(() => {
          router.push('/properties');
        }, 1500);
      } else {
        // CREATE MODE
        const payload = {
          name: data.name,
          location: data.location,
          googleLocation: data.googleLocation,
          description: data.description || undefined,
          beds: data.beds || undefined,
          bathrooms: data.bathrooms || undefined,
          sqft: data.sqft || undefined,
          maxOccupancy: data.maxOccupancy || undefined,
          totalShares: data.totalShares,
          availableShares: data.availableShares,
          initialPricePerShare: data.initialPricePerShare,
          currentPricePerShare: data.currentPricePerShare || undefined,
          wholeUnitPrice: data.wholeUnitPrice || undefined,
          targetIRR: data.targetIRR || undefined,
          targetRentalYield: data.targetRentalYield || undefined,
          appreciationRate: data.appreciationRate || undefined,
          possessionDate: convertToISO(data.possessionDate) || undefined,
          launchDate: convertToISO(data.launchDate) || undefined,
          maxBookingDays: data.maxBookingDays || undefined,
          bookingAmount: data.bookingAmount || undefined,
          bookingAmountGST: data.bookingAmountGST || undefined,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          amenityNames: data.amenityNames || undefined,
          documentNames: data.documentNames || undefined,
          certificateNames: data.certificateNames || undefined,
          floorPlanNames: data.floorPlanNames || undefined,
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
          paymentPlans: processedPaymentPlans.length > 0 ? processedPaymentPlans : undefined,
          certificates: data.certificates?.length > 0 ? data.certificates : undefined,
          floorPlans: data.floorPlans?.length > 0 ? data.floorPlans : undefined,
        };

        const response = await propertyService.createProperty(payload);

        setSubmitSuccess(response.message || 'Property created successfully!');
        toast.success('Property created successfully!');

        setTimeout(() => {
          router.push('/properties');
        }, 1500);
      }
    } catch (error: any) {
      const message =
        error?.message ||
        `Failed to ${propertyId ? 'update' : 'create'} property. Please try again.`;
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    errors: formErrors,
    isSubmitting,
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
    isLoading: isLoadingInitial,
    existingImages,
    existingVideos,
    existingDocuments,
    existingAmenities,
    existingCertificates,
    existingFloorPlans,
    existingPricingDetails,
    existingShareDetails,
    existingMaintenanceTemplates,
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
    isEditMode: !!propertyId,
  };
};
