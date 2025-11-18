import { formatFileSize } from '@/utils/fileValidation';
import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

interface CertificatesSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;

  // Images upload
  certificateImageDropzone: any;
  certificateImageFiles: File[];
  setCertificateImageFiles: (f: File[]) => void;

  // Helper
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;

  // Existing certificates from DB
  existingCertificates?: any[];
  onRemoveExisting?: (id: string) => void; // removeExistingCertificate

  // Form submission
  isSubmitting: boolean;
}

interface CertificateItem {
  id?: string; // for existing certificates
  name: string;
  description?: string;
  displayOrder?: number;
  file?: File; // for new uploads
  isExisting?: boolean;
  uniqueId: string; // stable unique identifier for React keys
}

interface CertificateItemRowProps {
  item: CertificateItem;
  index: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const CertificateItemRow = memo(({ item, index, onUpdate, onRemove, isSubmitting }: CertificateItemRowProps) => (
  <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="shrink-0">
          {item.isExisting ? (
            <ImageIcon className="w-5 h-5 text-blue-600" />
          ) : (
            <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
              <Plus className="w-3 h-3 text-green-600" />
            </div>
          )}
        </div>
        <h4 className="text-sm font-medium text-gray-700">
          Certificate #{index + 1}
        </h4>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="shrink-0 text-red-600 hover:text-red-700 transition-colors"
        title="Remove certificate"
        disabled={isSubmitting}
      >
        <X className="w-4 h-4" />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          placeholder="Enter certificate name (e.g., RERA Certificate)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Display Order
        </label>
        <input
          type="number"
          min="0"
          value={item.displayOrder || ''}
          onChange={(e) => onUpdate(index, 'displayOrder', parseInt(e.target.value) || 0)}
          placeholder="0"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
      </div>
    </div>

    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        value={item.description || ''}
        onChange={(e) => onUpdate(index, 'description', e.target.value)}
        placeholder="Optional description..."
        rows={2}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={isSubmitting}
        maxLength={500}
      />
    </div>

    {item.file && (
      <p className="text-xs text-gray-500 mt-2">
        File: {item.file.name} ({formatFileSize(item.file.size)})
      </p>
    )}
  </div>
));

CertificateItemRow.displayName = 'CertificateItemRow';

export default function CertificatesSection({
  register,
  errors,
  certificateImageDropzone,
  certificateImageFiles,
  setCertificateImageFiles,
  removeAt,
  setValue,
  getValues,
  existingCertificates = [],
  onRemoveExisting,
  isSubmitting,
}: CertificatesSectionProps) {
  const [certificateItems, setCertificateItems] = useState<CertificateItem[]>([]);

  // Initialize certificate items when component mounts or existing certificates change
  useEffect(() => {
    setCertificateItems(prev => {
      const updatedItems: CertificateItem[] = [];
      const previousMap = new Map(prev.map(item => [item.uniqueId, item]));

      // Add existing certificates
      existingCertificates.forEach((certificate) => {
        updatedItems.push({
          id: certificate.id,
          name: certificate.name,
          description: certificate.description,
          displayOrder: certificate.displayOrder,
          isExisting: true,
          uniqueId: certificate.id || `existing-${certificate.id}`,
        });
      });

      // Add new uploaded files - preserve their data if they were entered before
      certificateImageFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        updatedItems.push({
          name: previousItem?.name || '',
          description: previousItem?.description || '',
          displayOrder: previousItem?.displayOrder || 0,
          file,
          isExisting: false,
          uniqueId,
        });
      });

      return updatedItems;
    });
  }, [existingCertificates, certificateImageFiles]);

  // Update certificateNames whenever certificateItems change
  useEffect(() => {
    const names = certificateItems
      .filter(item => item.name.trim() !== '')
      .map(item => item.name.trim());
    const commaSeparatedNames = names.join(', ');
    setValue?.('certificateNames', commaSeparatedNames);
  }, [certificateItems, setValue]);

  // Update certificates array whenever certificateItems change
  // IMPORTANT: Only include NEW certificates (without id) that need images uploaded
  // Existing certificates are already in the database and should not be included
  useEffect(() => {
    const certificates = certificateItems
      .filter(item => item.name.trim() !== '' && !item.isExisting)
      .map((item) => ({
        name: item.name.trim(),
        description: item.description?.trim() || undefined,
        displayOrder: item.displayOrder || 0
      }));
    console.log('CertificatesSection: Setting certificates to:', certificates);
    setValue?.('certificates', certificates);
  }, [certificateItems, setValue]);

  const updateCertificateItem = useCallback((index: number, field: string, value: string | number) => {
    setCertificateItems(prev => prev.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const removeCertificateItem = useCallback((index: number) => {
    setCertificateItems(prev => {
      const item = prev[index];

      if (item.isExisting && item.id) {
        // Remove existing certificate
        onRemoveExisting?.(item.id);
      } else if (item.file) {
        // Remove new uploaded file
        const fileIndex = certificateImageFiles.findIndex(f => f === item.file);
        if (fileIndex !== -1) {
          removeAt(fileIndex, certificateImageFiles, setCertificateImageFiles, 'certificateImages');
        }
      }

      // Remove from local state
      return prev.filter((_, i) => i !== index);
    });
  }, [certificateImageFiles, removeAt, setCertificateImageFiles, onRemoveExisting]);

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <ImageIcon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Certificates</h2>
          <p className="text-sm text-gray-600">Add certificates with optional images</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Upload Certificate Images</h3>
          <span className="text-xs text-gray-500">Max 20 • JPG, PNG, WebP, GIF</span>
        </div>

        <FileUploadZone
          label=""
          dropzone={certificateImageDropzone}
          files={certificateImageFiles}
          onRemove={(idx) => {
            // Remove from files array, the useEffect will handle updating certificateItems
            removeAt(idx, certificateImageFiles, setCertificateImageFiles, 'certificateImages');
          }}
          error={errors.certificateImages}
          isSubmitting={isSubmitting}
        />

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Upload certificate images first, then enter the certificate names below for each one.
          </p>
        </div>
      </div>

      {/* Certificate Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Certificate Details {certificateItems.length > 0 && `(${certificateItems.length})`}
        </h3>

        {certificateItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No certificates added yet</p>
            <p className="text-xs">Upload certificate images above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificateItems.map((item, index) => (
              <CertificateItemRow
                key={item.uniqueId}
                item={item}
                index={index}
                onUpdate={updateCertificateItem}
                onRemove={removeCertificateItem}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}

        {/* Hidden field for comma-separated names (for backend compatibility) */}
        <input type="hidden" {...register('certificateNames')} />

        {errors.certificateNames && (
          <p className="mt-2 text-sm text-red-600">{errors.certificateNames.message}</p>
        )}
      </div>
    </div>
  );
}
