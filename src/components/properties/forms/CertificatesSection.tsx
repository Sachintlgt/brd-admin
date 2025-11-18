// src/components/properties/forms/CertificatesSection.tsx
import { formatFileSize } from '@/utils/fileValidation';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Award, FileCheck } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

interface CertificatesSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;
  certificateImageDropzone: any;
  certificateImageFiles: File[];
  setCertificateImageFiles: (f: File[]) => void;
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;
  existingCertificates?: any[];
  onRemoveExisting?: (id: string) => void;
  isSubmitting: boolean;
}

interface CertificateItem {
  id?: string;
  name: string;
  description: string;
  file?: File;
  isExisting?: boolean;
  uniqueId: string;
  displayOrder: number;
}

interface CertificateItemRowProps {
  item: CertificateItem;
  index: number;
  onUpdate: (index: number, field: 'name' | 'description', value: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const CertificateItemRow = memo(
  ({ item, index, onUpdate, onRemove, isSubmitting }: CertificateItemRowProps) => (
    <div className="p-4 transition-all border-2 border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-white hover:border-blue-300">
      <div className="flex items-start space-x-3">
        <div className="mt-1 shrink-0">
          {item.isExisting ? (
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Award className="w-5 h-5 text-blue-600" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <FileCheck className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Certificate Name * <span className="text-gray-500">(e.g., RERA Certificate)</span>
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="Enter certificate name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Description <span className="text-gray-500">(optional)</span>
            </label>
            <textarea
              value={item.description}
              onChange={(e) => onUpdate(index, 'description', e.target.value)}
              placeholder="Brief description of this certificate"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          {item.file && (
            <div className="p-2 bg-gray-100 border border-gray-200 rounded">
              <p className="text-xs font-medium text-gray-700">{item.file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(item.file.size)}</p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-2 text-red-500 transition-colors rounded-lg shrink-0 hover:text-red-700 hover:bg-red-50"
          title="Remove certificate"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  ),
);

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

  useEffect(() => {
    setCertificateItems((prev) => {
      const updatedItems: CertificateItem[] = [];
      const previousMap = new Map(prev.map((item) => [item.uniqueId, item]));

      existingCertificates.forEach((certificate, idx) => {
        updatedItems.push({
          id: certificate.id,
          name: certificate.name || '',
          description: certificate.description || '',
          isExisting: true,
          uniqueId: certificate.id || `existing-${certificate.id}`,
          displayOrder: idx + 1,
        });
      });

      certificateImageFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        const fileName = file.name.replace(/\.[^/.]+$/, '');

        updatedItems.push({
          name: previousItem?.name || fileName,
          description: previousItem?.description || '',
          file,
          isExisting: false,
          uniqueId,
          displayOrder: existingCertificates.length + index + 1,
        });
      });

      return updatedItems;
    });
  }, [existingCertificates, certificateImageFiles]);

  useEffect(() => {
    const certificates = certificateItems
      .filter((item) => item.name.trim() !== '')
      .map((item) => ({
        name: item.name.trim(),
        description: item.description?.trim() || '',
        displayOrder: item.displayOrder,
      }));
    setValue?.('certificates', certificates);
  }, [certificateItems, setValue]);

  const updateCertificate = useCallback(
    (index: number, field: 'name' | 'description', value: string) => {
      setCertificateItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      );
    },
    [],
  );

  const removeCertificateItem = useCallback(
    (index: number) => {
      setCertificateItems((prev) => {
        const item = prev[index];

        if (item.isExisting && item.id) {
          onRemoveExisting?.(item.id);
        } else if (item.file) {
          const fileIndex = certificateImageFiles.findIndex((f) => f === item.file);
          if (fileIndex !== -1) {
            removeAt(
              fileIndex,
              certificateImageFiles,
              setCertificateImageFiles,
              'certificateImages',
            );
          }
        }

        return prev.filter((_, i) => i !== index);
      });
    },
    [certificateImageFiles, removeAt, setCertificateImageFiles, onRemoveExisting],
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center mb-6 space-x-3">
        <div className="p-2 rounded-lg bg-indigo-50">
          <Award className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Certificates & Approvals</h2>
          <p className="text-sm text-gray-600">Add property certifications (images optional)</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">
            Upload Certificate Images (Optional)
          </h3>
          <span className="text-xs text-gray-500">Max 10 • JPG, PNG, WebP, GIF</span>
        </div>

        <FileUploadZone
          label=""
          dropzone={certificateImageDropzone}
          files={certificateImageFiles}
          onRemove={(idx) => {
            removeAt(idx, certificateImageFiles, setCertificateImageFiles, 'certificateImages');
          }}
          error={errors.certificateImages}
          isSubmitting={isSubmitting}
        />

        <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50">
          <p className="text-xs text-blue-800">
            <strong>Auto-naming:</strong> File names will be used as default certificate names. You
            can edit them below.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Certificate Details {certificateItems.length > 0 && `(${certificateItems.length})`}
        </h3>

        {certificateItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg">
            <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No certificates added yet</p>
            <p className="text-xs">Upload images or add certificate details manually</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificateItems.map((item, index) => (
              <CertificateItemRow
                key={item.uniqueId}
                item={item}
                index={index}
                onUpdate={updateCertificate}
                onRemove={removeCertificateItem}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}

        {errors.certificates && (
          <p className="mt-2 text-sm text-red-600">{errors.certificates.message}</p>
        )}
      </div>
    </div>
  );
}
