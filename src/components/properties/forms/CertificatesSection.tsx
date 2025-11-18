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
  file?: File; // for new uploads
  isExisting?: boolean;
  uniqueId: string; // stable unique identifier for React keys
}

interface CertificateItemRowProps {
  item: CertificateItem;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const CertificateItemRow = memo(({ item, index, onUpdate, onRemove, isSubmitting }: CertificateItemRowProps) => (
  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
    <div className="shrink-0">
      {item.isExisting ? (
        <ImageIcon className="w-5 h-5 text-blue-600" />
      ) : (
        <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
          <Plus className="w-3 h-3 text-green-600" />
        </div>
      )}
    </div>

    <div className="flex-1">
      <input
        type="text"
        value={item.name}
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder="Enter certificate name (e.g., RERA Certificate)"
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        disabled={isSubmitting}
      />
      {item.file && (
        <p className="text-xs text-gray-500 mt-1">
          {item.file.name} ({formatFileSize(item.file.size)})
        </p>
      )}
    </div>

    <button
      type="button"
      onClick={() => onRemove(index)}
      className="shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
      title="Remove certificate"
      disabled={isSubmitting}
    >
      <X className="w-4 h-4" />
    </button>
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
          isExisting: true,
          uniqueId: certificate.id || `existing-${certificate.id}`,
        });
      });

      // Add new uploaded files - preserve their names if they were entered before
      certificateImageFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        updatedItems.push({
          name: previousItem?.name || '', // Preserve previous name if it exists
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
  useEffect(() => {
    const certificates = certificateItems
      .filter(item => item.name.trim() !== '')
      .map((item, index) => ({
        name: item.name.trim(),
        imageUrl: 'will-be-uploaded',
        description: '', // Could be enhanced to include description field later
        displayOrder: index + 1
      }));
    setValue?.('certificates', certificates);
  }, [certificateItems, setValue]);

  const updateCertificateName = useCallback((index: number, name: string) => {
    setCertificateItems(prev => prev.map((item, i) =>
      i === index ? { ...item, name } : item
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
                onUpdate={updateCertificateName}
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
