// src/utils/fileValidation.ts
import { MIME_TYPES, FILE_LIMITS } from "@/validations/property.validation";

export interface FileValidationError {
  file: string;
  error: string;
}

export const fileValidationRules = {
  image: {
    allowedMimes: MIME_TYPES.ALLOWED_IMAGE_MIMES,
    maxSize: FILE_LIMITS.image,
    displaySize: "10 MB",
    types: "JPG, PNG, WebP, GIF",
  },
  video: {
    allowedMimes: MIME_TYPES.ALLOWED_VIDEO_MIMES,
    maxSize: FILE_LIMITS.video,
    displaySize: "100 MB",
    types: "MP4, MPEG, MOV, AVI, WebM",
  },
  document: {
    allowedMimes: MIME_TYPES.ALLOWED_DOCUMENT_MIMES,
    maxSize: FILE_LIMITS.document,
    displaySize: "20 MB",
    types: "PDF, DOC, DOCX, XLS, XLSX, Images",
  },
  icon: {
    allowedMimes: MIME_TYPES.ALLOWED_ICON_MIMES,
    maxSize: FILE_LIMITS.icon,
    displaySize: "2 MB",
    types: "JPG, PNG, SVG, WebP",
  },
};

/**
 * Validate a single file
 * @param file The file to validate
 * @param type The type of file (image, video, document, icon)
 * @returns null if valid, error message if invalid
 */
export const validateFile = (
  file: File,
  type: keyof typeof fileValidationRules
): string | null => {
  const rules = fileValidationRules[type];

  // Check MIME type
  if (!rules.allowedMimes.includes(file.type)) {
    return `Invalid file type. Allowed: ${rules.types}`;
  }

  // Check file size
  if (file.size > rules.maxSize) {
    return `File size exceeds ${rules.displaySize} limit`;
  }

  return null;
};

/**
 * Validate an array of files
 * @param files Array of files to validate
 * @param type The type of files
 * @returns Array of validation errors
 */
export const validateFiles = (
  files: File[],
  type: keyof typeof fileValidationRules
): FileValidationError[] => {
  const errors: FileValidationError[] = [];

  files.forEach((file) => {
    const error = validateFile(file, type);
    if (error) {
      errors.push({ file: file.name, error });
    }
  });

  return errors;
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export const getMimeTypeDescription = (mimeType: string): string => {
  const mimeMap: Record<string, string> = {
    "image/jpeg": "JPEG Image",
    "image/png": "PNG Image",
    "image/webp": "WebP Image",
    "image/gif": "GIF Image",
    "image/svg+xml": "SVG Image",
    "video/mp4": "MP4 Video",
    "video/mpeg": "MPEG Video",
    "video/quicktime": "MOV Video",
    "video/x-msvideo": "AVI Video",
    "video/webm": "WebM Video",
    "application/pdf": "PDF Document",
    "application/msword": "Word Document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "Word Document (DOCX)",
    "application/vnd.ms-excel": "Excel Spreadsheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      "Excel Spreadsheet (XLSX)",
  };
  return mimeMap[mimeType] || mimeType;
};

