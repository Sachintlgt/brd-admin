import { Upload, X, Image } from 'lucide-react';
import { formatFileSize } from '../../utils/fileValidation';
import React, { useState, useEffect } from 'react';

interface FileUploadZoneProps {
  label: string;
  dropzone: any;
  files: File[];
  onRemove: (index: number) => void;
  error?: any;
  isSubmitting?: boolean;
}

export default function FileUploadZone({
  label,
  dropzone,
  files,
  onRemove,
  error,
  isSubmitting,
}: FileUploadZoneProps) {
  const [previews, setPreviews] = useState<{ [key: number]: string }>({});

  const isImageFile = (file: File) => file.type.startsWith('image/');

  // Generate preview URLs for image files
  useEffect(() => {
    const newPreviews: { [key: number]: string } = {};
    files.forEach((file, idx) => {
      if (isImageFile(file)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews[idx] = e.target?.result as string;
          setPreviews((prev) => ({ ...prev, ...newPreviews }));
        };
        reader.readAsDataURL(file);
      }
    });
  }, [files]);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <div
          {...(isSubmitting ? {} : dropzone.getRootProps())}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
            error
              ? 'border-red-300 bg-red-50 hover:border-red-400'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="w-6 h-6 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            </div>
          )}
          <input {...dropzone.getInputProps()} disabled={isSubmitting} />
          <Upload className={`mx-auto h-8 w-8 ${error ? 'text-red-400' : 'text-gray-400'}`} />
          <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
            Drop files here or click to upload
          </p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-3">
          {files.map((file, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <div className="flex items-center justify-between p-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="ml-2 text-red-500 hover:text-red-700 shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {previews[idx] && isImageFile(file) && (
                <div className="px-3 pb-3">
                  <img
                    src={previews[idx]}
                    alt={file.name}
                    className="max-h-48 max-w-full rounded border border-gray-300 object-contain"
                  />
                </div>
              )}
              {!isImageFile(file) && (
                <div className="px-3 pb-3 flex items-center justify-center h-24 bg-gray-100 border-t border-gray-200">
                  <div className="text-center">
                    <Image className="h-8 w-8 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500">File preview not available</p>
                  </div>
                </div>
              )}
              {error?.[idx]?.message && (
                <p className="px-3 pb-3 text-sm text-red-600">{error[idx].message}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
