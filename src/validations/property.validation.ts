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

// Pricing Detail Schema
const pricingDetailSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  price: z.coerce.number().gt(0, 'Price must be greater than 0'),
  type: z.enum(['ONE_TIME', 'PHASE']),
  phaseName: z.string().optional(),
  description: z.string().optional(),
  effectiveFrom: z.string().optional(),
  effectiveTo: z.string().optional(),
});

// Share Detail Schema
const shareDetailSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  shareCount: z.coerce
    .number()
    .int('Share count must be an integer')
    .min(1, 'Share count must be at least 1')
    .optional()
    .or(z.literal('')),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0').optional().or(z.literal('')),
});

// Maintenance Template Schema
const maintenanceTemplateSchema = z.object({
  chargeType: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME']),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
  description: z.string().optional(),
  dueDay: z.coerce
    .number()
    .int('Due day must be an integer')
    .min(1, 'Due day must be between 1-31')
    .max(31, 'Due day must be between 1-31')
    .optional()
    .or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Highlight Schema
const highlightSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  label: z.string().min(1, 'Label is required'),
  value: z.string().min(1, 'Value is required'),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

// Certificate Schema
const certificateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

// Floor Plan Schema
const floorPlanSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().max(500, 'Description cannot exceed 500 characters').optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

// Payment Plan Schema
const paymentPlanSchema = z.object({
  planType: z.enum(['INSTALMENT', 'BIFURCATION']),
  purchaseType: z.enum(['WHOLE_UNIT', 'FRACTIONAL']),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  amount: z.coerce.number().gt(0, 'Amount must be greater than 0'),
  percentage: z.coerce.number().min(0).max(100).optional(),
  milestone: z.string().optional(),
  dueDate: z.string().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
  isGSTIncluded: z.boolean().default(false),
  gstPercentage: z.coerce.number().min(0).max(100).optional(),
}).superRefine((data, ctx) => {
  // If isGSTIncluded is true, gstPercentage is required
  if (data.isGSTIncluded && (data.gstPercentage === undefined || data.gstPercentage === null)) {
    ctx.addIssue({
      path: ['gstPercentage'],
      code: z.ZodIssueCode.custom,
      message: 'GST percentage is required when GST is included',
    });
  }
});

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

    // Property Details (Optional)
    beds: z.coerce
      .number()
      .int('Beds must be an integer')
      .min(1, 'Beds must be at least 1')
      .optional(),
    bathrooms: z.coerce
      .number()
      .int('Bathrooms must be an integer')
      .min(1, 'Bathrooms must be at least 1')
      .optional(),
    sqft: z.coerce
      .number()
      .positive('Sqft must be a positive number')
      .optional(),
    maxOccupancy: z
      .string()
      .max(100, 'Max occupancy must not exceed 100 characters')
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

    // Pricing (Required)
    initialPricePerShare: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Initial price per share must be a number' })
      .positive({ message: 'Initial price per share must be positive' })
      .max(100000000, { message: 'Initial price per share cannot exceed 100,000,000' }),
    currentPricePerShare: z.coerce
      .number()
      .positive({ message: 'Current price per share must be positive' })
      .optional(),
    wholeUnitPrice: z.coerce
      .number()
      .positive({ message: 'Whole unit price must be positive' })
      .optional(),

    // Financial Metrics (Optional)
    targetIRR: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Target IRR must be a number' })
      .min(0, { message: 'Target IRR cannot be negative' })
      .max(100, { message: 'Target IRR must not exceed 100%' })
      .optional(),
    targetRentalYield: z
      .string()
      .max(50, 'Target rental yield must not exceed 50 characters')
      .optional(),

    appreciationRate: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Appreciation rate must be a number' })
      .min(0, { message: 'Appreciation rate must be ≥ 0' })
      .max(100, { message: 'Appreciation rate cannot exceed 100%' })
      .optional(),

    // Dates (Optional)
    possessionDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format for possession date' })
      .optional(),
    launchDate: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format for launch date' })
      .optional(),

    maxBookingDays: z.coerce
      .number()
      .refine((n) => !Number.isNaN(n), { message: 'Max booking days must be a number' })
      .int({ message: 'Max booking days must be an integer' })
      .min(1, { message: 'Max booking days must be at least 1' })
      .max(365, { message: 'Max booking days cannot exceed 365' })
      .optional(),

    // Booking Configuration (Optional)
    bookingAmount: z.coerce
      .number()
      .positive({ message: 'Booking amount must be positive' })
      .optional(),
    bookingAmountGST: z.coerce
      .number()
      .min(0, { message: 'Booking amount GST cannot be negative' })
      .optional(),

    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),

    amenityNames: z.string().optional(),
    documentNames: z.string().optional(),
    certificateNames: z.string().optional(),
    floorPlanNames: z.string().optional(),

    propertyImages: z
      .array(z.string())
      .max(20, { message: 'Maximum 20 images allowed' })
      .optional(),
    propertyVideos: z.array(z.string()).max(5, { message: 'Maximum 5 videos allowed' }).optional(),
    amenityIcons: z.array(z.string()).max(50, { message: 'Maximum 50 amenity icons allowed' }).optional(),
    documents: z.array(z.string()).max(10, { message: 'Maximum 10 documents allowed' }).optional(),
    certificateImages: z.array(z.string()).max(10, { message: 'Maximum 10 certificate images allowed' }).optional(),
    floorPlanImages: z.array(z.string()).max(10, { message: 'Maximum 10 floor plan images allowed' }).optional(),

    // File objects for validation
    imageFiles: z.array(z.instanceof(File)).optional(),
    videoFiles: z.array(z.instanceof(File)).optional(),
    documentFiles: z.array(z.instanceof(File)).optional(),
    iconFiles: z.array(z.instanceof(File)).optional(),
    certificateImageFiles: z.array(z.instanceof(File)).optional(),
    floorPlanImageFiles: z.array(z.instanceof(File)).optional(),

    pricingDetails: z.array(pricingDetailSchema).optional().default([]),
    shareDetails: z.array(shareDetailSchema).optional().default([]),
    maintenanceTemplates: z.array(maintenanceTemplateSchema).optional().default([]),
    highlights: z.array(highlightSchema).optional().default([]),
    certificates: z.array(certificateSchema).optional().default([]),
    floorPlans: z.array(floorPlanSchema).optional().default([]),
    paymentPlans: z.array(paymentPlanSchema).optional().default([]),
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
            path: ['imageFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `Invalid file type. Allowed: JPG, PNG, WebP, GIF`
          });
        }
        if (file.size > FILE_SIZE_LIMITS.image) {
          ctx.addIssue({
            path: ['imageFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `File size exceeds 10 MB limit`
          });
        }
      });
    }

    // Validate video files
    if (data.videoFiles && data.videoFiles.length > 0) {
      data.videoFiles.forEach((file, idx) => {
        if (!ALLOWED_VIDEO_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['videoFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `Invalid file type. Allowed: MP4, MPEG, MOV, AVI, WebM`
          });
        }
        if (file.size > FILE_SIZE_LIMITS.video) {
          ctx.addIssue({
            path: ['videoFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `File size exceeds 100 MB limit`
          });
        }
      });
    }

    // Validate document files
    if (data.documentFiles && data.documentFiles.length > 0) {
      data.documentFiles.forEach((file, idx) => {
        if (!ALLOWED_DOCUMENT_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['documentFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `Invalid file type. Allowed: PDF, DOC, DOCX, XLS, XLSX, Images`
          });
        }
        if (file.size > FILE_SIZE_LIMITS.document) {
          ctx.addIssue({
            path: ['documentFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `File size exceeds 20 MB limit`
          });
        }
      });
    }

    // Validate icon files
    if (data.iconFiles && data.iconFiles.length > 0) {
      data.iconFiles.forEach((file, idx) => {
        if (!ALLOWED_ICON_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['iconFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `Invalid file type. Allowed: JPG, PNG, SVG, WebP`
          });
        }
        if (file.size > FILE_SIZE_LIMITS.icon) {
          ctx.addIssue({
            path: ['iconFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `File size exceeds 2 MB limit`
          });
        }
      });
    }

    // Validate certificate image files
    if (data.certificateImageFiles && data.certificateImageFiles.length > 0) {
      data.certificateImageFiles.forEach((file, idx) => {
        if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['certificateImageFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `Invalid file type. Allowed: JPG, PNG, WebP, GIF`
          });
        }
        if (file.size > FILE_SIZE_LIMITS.image) {
          ctx.addIssue({
            path: ['certificateImageFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `File size exceeds 10 MB limit`
          });
        }
      });
    }

    // Validate floor plan image files
    if (data.floorPlanImageFiles && data.floorPlanImageFiles.length > 0) {
      data.floorPlanImageFiles.forEach((file, idx) => {
        if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
          ctx.addIssue({
            path: ['floorPlanImageFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `Invalid file type. Allowed: JPG, PNG, WebP, GIF`
          });
        }
        if (file.size > FILE_SIZE_LIMITS.image) {
          ctx.addIssue({
            path: ['floorPlanImageFiles', idx],
            code: z.ZodIssueCode.custom,
            message: `File size exceeds 10 MB limit`
          });
        }
      });
    }

    // documentNames count must match documentFiles count only if NEW documents are being uploaded
    if (data.documentFiles && data.documentFiles.length > 0) {
      const namesCount = (data.documentNames ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (namesCount === 0 || namesCount !== data.documentFiles.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Document names count must match the number of uploaded documents',
          path: ['documentNames'],
        });
      }
    }

    // amenityIcons must match amenityNames count when icons are provided (only for NEW icons)
    if (data.iconFiles && data.iconFiles.length > 0) {
      const namesCount = (data.amenityNames ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean).length;
      if (namesCount === 0 || namesCount !== data.iconFiles.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Amenity names count must match the number of uploaded icons',
          path: ['amenityNames'],
        });
      }
    }
    // Validate Pricing Details
    /* ────────────────────────  PRICING DETAILS  ──────────────────────── */
    if (data.pricingDetails && data.pricingDetails.length > 0) {
      const pricingErrors: string[] = [];

      data.pricingDetails.forEach((pricing, idx) => {
        // PHASE type validations
        if (pricing.type === 'PHASE') {
          if (!pricing.phaseName?.trim()) {
            pricingErrors.push(`Pricing #${idx + 1}: Phase name is required`);
          }
          if (!pricing.effectiveFrom) {
            pricingErrors.push(`Pricing #${idx + 1}: Effective from date is required`);
          }
          if (!pricing.effectiveTo) {
            pricingErrors.push(`Pricing #${idx + 1}: Effective to date is required`);
          }

          // date format & range
          if (pricing.effectiveFrom && pricing.effectiveTo) {
            const from = new Date(pricing.effectiveFrom);
            const to = new Date(pricing.effectiveTo);

            if (Number.isNaN(from.getTime())) {
              pricingErrors.push(`Pricing #${idx + 1}: Invalid effectiveFrom date`);
            }
            if (Number.isNaN(to.getTime())) {
              pricingErrors.push(`Pricing #${idx + 1}: Invalid effectiveTo date`);
            }
            if (!Number.isNaN(from.getTime()) && !Number.isNaN(to.getTime()) && to <= from) {
              pricingErrors.push(`Pricing #${idx + 1}: End date must be after start date`);
            }
          }
        }
      });

      // ---- phase overlap detection ----
      const phases = data.pricingDetails
        .map((p, i) => ({ ...p, idx: i }))
        .filter((p) => p.type === 'PHASE' && p.effectiveFrom && p.effectiveTo);

      for (let i = 0; i < phases.length; i++) {
        for (let j = i + 1; j < phases.length; j++) {
          const a = phases[i],
            b = phases[j];
          const s1 = new Date(a.effectiveFrom!),
            e1 = new Date(a.effectiveTo!);
          const s2 = new Date(b.effectiveFrom!),
            e2 = new Date(b.effectiveTo!);

          if ((s1 <= e2 && e1 >= s2) || (s2 <= e1 && e2 >= s1)) {
            const l1 = a.label || `Phase ${a.idx + 1}`;
            const l2 = b.label || `Phase ${b.idx + 1}`;
            pricingErrors.push(`Phase overlap between "${l1}" and "${l2}"`);
          }
        }
      }

      if (pricingErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: pricingErrors.join('\n'),
          path: ['pricingDetails'],
        });
      }
    }

    /* ────────────────────────  SHARE DETAILS  ──────────────────────── */
    if (data.shareDetails && data.shareDetails.length > 0) {
      const shareErrors: string[] = [];

      data.shareDetails.forEach((detail, idx) => {
        if (!detail.title?.trim()) {
          shareErrors.push(`Share detail #${idx + 1}: Title is required`);
        }
        if (
          detail.shareCount != null &&
          detail.shareCount !== '' &&
          Number(detail.shareCount) < 1
        ) {
          shareErrors.push(`Share detail #${idx + 1}: Share count must be ≥ 1`);
        }
        if (detail.amount != null && detail.amount !== '' && Number(detail.amount) <= 0) {
          shareErrors.push(`Share detail #${idx + 1}: Amount must be > 0`);
        }
      });

      if (shareErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: shareErrors.join('\n'),
          path: ['shareDetails'],
        });
      }
    }

    /* ────────────────────────  MAINTENANCE TEMPLATES  ──────────────────────── */
    if (data.maintenanceTemplates && data.maintenanceTemplates.length > 0) {
      const maintErrors: string[] = [];

      data.maintenanceTemplates.forEach((tpl, idx) => {
        const validTypes = ['MONTHLY', 'QUARTERLY', 'YEARLY', 'ONE_TIME'] as const;
        if (!validTypes.includes(tpl.chargeType as any)) {
          maintErrors.push(
            `Maintenance #${idx + 1}: Invalid charge type – must be MONTHLY, QUARTERLY, YEARLY or ONE_TIME`,
          );
        }

        const recurring = ['MONTHLY', 'QUARTERLY', 'YEARLY'] as const;
        if (recurring.includes(tpl.chargeType as any)) {
          if (!tpl.dueDay) {
            maintErrors.push(`Maintenance #${idx + 1}: Due day is required for ${tpl.chargeType}`);
          } else {
            const day = Number(tpl.dueDay);
            if (day < 1 || day > 31) {
              maintErrors.push(`Maintenance #${idx + 1}: Due day must be 1‑31`);
            }
          }
        }

        // start / end date range
        if (tpl.startDate && tpl.endDate) {
          const start = new Date(tpl.startDate);
          const end = new Date(tpl.endDate);

          if (Number.isNaN(start.getTime())) {
            maintErrors.push(`Maintenance #${idx + 1}: Invalid start date`);
          }
          if (Number.isNaN(end.getTime())) {
            maintErrors.push(`Maintenance #${idx + 1}: Invalid end date`);
          }
          if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end <= start) {
            maintErrors.push(`Maintenance #${idx + 1}: End date must be after start date`);
          }
        }
      });

      if (maintErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: maintErrors.join('\n'),
          path: ['maintenanceTemplates'],
        });
      }
    }

    /* ────────────────────────  HIGHLIGHTS  ──────────────────────── */
    if (data.highlights && data.highlights.length > 0) {
      const highlightErrors: string[] = [];

      data.highlights.forEach((highlight, idx) => {
        if (!highlight.key?.trim()) {
          highlightErrors.push(`Highlight #${idx + 1}: Key is required`);
        }
        if (!highlight.label?.trim()) {
          highlightErrors.push(`Highlight #${idx + 1}: Label is required`);
        }
        if (!highlight.value?.trim()) {
          highlightErrors.push(`Highlight #${idx + 1}: Value is required`);
        }
      });

      if (highlightErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: highlightErrors.join('\n'),
          path: ['highlights'],
        });
      }
    }

    /* ────────────────────────  CERTIFICATES  ──────────────────────── */
    if (data.certificates && data.certificates.length > 0) {
      const certificateErrors: string[] = [];

      data.certificates.forEach((cert, idx) => {
        if (!cert.name?.trim()) {
          certificateErrors.push(`Certificate #${idx + 1}: Name is required`);
        }
      });

      if (certificateErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: certificateErrors.join('\n'),
          path: ['certificates'],
        });
      }
    }

    /* ────────────────────────  FLOOR PLANS  ──────────────────────── */
    if (data.floorPlans && data.floorPlans.length > 0) {
      const floorPlanErrors: string[] = [];

      data.floorPlans.forEach((plan, idx) => {
        if (!plan.name?.trim()) {
          floorPlanErrors.push(`Floor plan #${idx + 1}: Name is required`);
        }
      });

      if (floorPlanErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: floorPlanErrors.join('\n'),
          path: ['floorPlans'],
        });
      }
    }

    /* ────────────────────────  PAYMENT PLANS  ──────────────────────── */
    if (data.paymentPlans && data.paymentPlans.length > 0) {
      const paymentPlanErrors: string[] = [];

      data.paymentPlans.forEach((plan, idx) => {
        if (!plan.planType) {
          paymentPlanErrors.push(`Payment plan #${idx + 1}: Plan type is required`);
        }
        if (!plan.name?.trim()) {
          paymentPlanErrors.push(`Payment plan #${idx + 1}: Name is required`);
        }
        if (plan.amount == null || plan.amount <= 0) {
          paymentPlanErrors.push(`Payment plan #${idx + 1}: Amount must be greater than 0`);
        }
        if (!plan.purchaseType) {
          paymentPlanErrors.push(`Payment plan #${idx + 1}: Purchase type is required`);
        }
      });

      if (paymentPlanErrors.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: paymentPlanErrors.join('\n'),
          path: ['paymentPlans'],
        });
      }
    }

    // Business Logic Validations
    // Certificate images must match certificates count only if NEW certificate images are being uploaded
    if (data.certificateImageFiles && data.certificateImageFiles.length > 0) {
      if (data.certificates && data.certificates.length > 0) {
        if (!data.certificateImages || data.certificateImages.length !== data.certificates.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Number of certificate images must match certificates count',
            path: ['certificateImages'],
          });
        }
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Certificate images provided but no certificate data specified',
          path: ['certificateImages'],
        });
      }
    }

    // Floor plan images must match floor plans count only if NEW floor plan images are being uploaded
    if (data.floorPlanImageFiles && data.floorPlanImageFiles.length > 0) {
      if (data.floorPlans && data.floorPlans.length > 0) {
        if (!data.floorPlanImages || data.floorPlanImages.length !== data.floorPlans.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Number of floor plan images must match floor plans count',
            path: ['floorPlanImages'],
          });
        }
      } else {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Floor plan images provided but no floor plan data specified',
          path: ['floorPlanImages'],
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
