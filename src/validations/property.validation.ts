// src/validations/property.validation.ts
import { z } from 'zod';

// MIME types for file validation
const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_MIMES = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime',
  'video/x-msvideo',
  'video/webm',
];
const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/webp',
];
const ALLOWED_ICON_MIMES = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];

// File size limits (in bytes)
const FILE_SIZE_LIMITS = {
  image: 10 * 1024 * 1024, // 10 MB
  video: 100 * 1024 * 1024, // 100 MB
  document: 20 * 1024 * 1024, // 20 MB
  icon: 2 * 1024 * 1024, // 2 MB
};

export const propertySchema = z
  .object({
    name: z
      .string()
      .min(3, { message: 'Property name must be at least 3 characters' })
      .max(200, { message: 'Property name cannot exceed 200 characters' }),
    location: z
      .string()
      .min(3, { message: 'Location must be at least 3 characters' })
      .max(200, { message: 'Location cannot exceed 200 characters' }),
    description: z
      .string()
      .max(2000, { message: 'Description cannot exceed 2000 characters' })
      .optional(),

    totalShares: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Total shares must be a number' })
      .int({ message: 'Total shares must be an integer' })
      .min(1, { message: 'Total shares must be at least 1' })
      .max(1000000, { message: 'Total shares cannot exceed 1,000,000' }),

    availableShares: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Available shares must be a number' })
      .int({ message: 'Available shares must be an integer' })
      .min(0, { message: 'Available shares must be ≥ 0' })
      .max(1000000, { message: 'Available shares cannot exceed 1,000,000' }),

    pricePerShare: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Price per share must be a number' })
      .min(0, { message: 'Price per share must be ≥ 0' })
      .max(100000000, { message: 'Price per share cannot exceed 100,000,000' }),

    appreciationRate: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Appreciation rate must be a number' })
      .min(0, { message: 'Appreciation rate must be ≥ 0' })
      .max(100, { message: 'Appreciation rate cannot exceed 100%' })
      .optional(),

    maxBookingDays: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Max booking days must be a number' })
      .int({ message: 'Max booking days must be an integer' })
      .min(1, { message: 'Max booking days must be at least 1' })
      .max(365, { message: 'Max booking days cannot exceed 365' })
      .optional(),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),

    amenityNames: z.string().optional(),
    documentNames: z.string().optional(),

    propertyImages: z
      .array(z.string())
      .min(1, { message: 'At least 1 image is required' })
      .max(20, { message: 'Maximum 20 images allowed' }),
    propertyVideos: z.array(z.string()).max(5, { message: 'Maximum 5 videos allowed' }).optional(),
    amenityIcons: z.array(z.string()).optional(),
    documents: z.array(z.string()).max(10, { message: 'Maximum 10 documents allowed' }).optional(),

    // File objects for validation
    imageFiles: z.array(z.instanceof(File)).optional(),
    videoFiles: z.array(z.instanceof(File)).optional(),
    documentFiles: z.array(z.instanceof(File)).optional(),
    iconFiles: z.array(z.instanceof(File)).optional(),
  })
  .superRefine((data, ctx) => {
    // availableShares <= totalShares
    if (typeof data.availableShares === 'number' && typeof data.totalShares === 'number') {
      if (data.availableShares > data.totalShares) {
        ctx.addIssue({
          path: ['availableShares'],
          code: z.ZodIssueCode.custom,
          message: 'Available shares cannot exceed total shares',
        });
      }
    }

    // Validate image files
    if (data.imageFiles && data.imageFiles.length > 0) {
      data.imageFiles.forEach((file, idx) => {
        if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['propertyImages'],
            code: z.ZodIssueCode.custom,
            message: `Image ${idx + 1}: Invalid file type. Allowed: JPG, PNG, WebP, GIF`,
          });
        }
        if (file.size > FILE_SIZE_LIMITS.image) {
          ctx.addIssue({
            path: ['propertyImages'],
            code: z.ZodIssueCode.custom,
            message: `Image ${idx + 1}: File size exceeds 10 MB limit`,
          });
        }
      });
    }

    // Validate video files
    if (data.videoFiles && data.videoFiles.length > 0) {
      data.videoFiles.forEach((file, idx) => {
        if (!ALLOWED_VIDEO_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['propertyVideos'],
            code: z.ZodIssueCode.custom,
            message: `Video ${idx + 1}: Invalid file type. Allowed: MP4, MPEG, MOV, AVI, WebM`,
          });
        }
        if (file.size > FILE_SIZE_LIMITS.video) {
          ctx.addIssue({
            path: ['propertyVideos'],
            code: z.ZodIssueCode.custom,
            message: `Video ${idx + 1}: File size exceeds 100 MB limit`,
          });
        }
      });
    }

    // Validate document files
    if (data.documentFiles && data.documentFiles.length > 0) {
      data.documentFiles.forEach((file, idx) => {
        if (!ALLOWED_DOCUMENT_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['documents'],
            code: z.ZodIssueCode.custom,
            message: `Document ${idx + 1}: Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, Images`,
          });
        }
        if (file.size > FILE_SIZE_LIMITS.document) {
          ctx.addIssue({
            path: ['documents'],
            code: z.ZodIssueCode.custom,
            message: `Document ${idx + 1}: File size exceeds 20 MB limit`,
          });
        }
      });
    }

    // Validate icon files
    if (data.iconFiles && data.iconFiles.length > 0) {
      data.iconFiles.forEach((file, idx) => {
        if (!ALLOWED_ICON_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['amenityIcons'],
            code: z.ZodIssueCode.custom,
            message: `Icon ${idx + 1}: Invalid file type. Allowed: JPG, PNG, SVG, WebP`,
          });
        }
        if (file.size > FILE_SIZE_LIMITS.icon) {
          ctx.addIssue({
            path: ['amenityIcons'],
            code: z.ZodIssueCode.custom,
            message: `Icon ${idx + 1}: File size exceeds 2 MB limit`,
          });
        }
      });
    }

    // documentNames count must match documents count if provided
    if (data.documentNames && data.documentNames.trim().length > 0) {
      const namesCount = data.documentNames
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length;
      const docsCount = data.documents?.length ?? 0;
      if (namesCount !== docsCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Document names count must match the number of uploaded documents',
          path: ['documentNames'],
        });
      }
    }

    // amenityIcons must match amenityNames count when icons are provided
    if (data.amenityIcons && data.amenityIcons.length > 0) {
      const namesCount = (data.amenityNames ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (namesCount === 0 || namesCount !== data.amenityIcons.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Amenity icons count must match amenity names count',
          path: ['amenityIcons'],
        });
      }
    }
  });

export type PropertyFormValues = z.infer<typeof propertySchema>;

export const MIME_TYPES = {
  ALLOWED_IMAGE_MIMES,
  ALLOWED_VIDEO_MIMES,
  ALLOWED_DOCUMENT_MIMES,
  ALLOWED_ICON_MIMES,
};

export const FILE_LIMITS = FILE_SIZE_LIMITS;
