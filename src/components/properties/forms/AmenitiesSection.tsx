import { formatFileSize } from '@/utils/fileValidation';
import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, memo, useCallback, useRef } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface AmenitiesSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;
  iconDropzone: any;
  iconFiles: File[];
  setIconFiles: (f: File[]) => void;
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;
  existingAmenities?: any[];
  onRemoveExisting?: (id: string) => void;
  isSubmitting: boolean;
  syncAmenityItems?: (items: any[]) => void;
}

interface AmenityItem {
  id?: string;
  name: string;
  file?: File;
  fileIndex?: number;
  isExisting?: boolean;
  uniqueId: string;
  isNameOnly?: boolean;
  iconUrl?: string;
}

interface AmenityItemRowProps {
  item: AmenityItem;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const AmenityItemRow = memo(
  ({ item, index, onUpdate, onRemove, isSubmitting }: AmenityItemRowProps) => {
    return (
      <div className="flex items-center p-3 space-x-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="shrink-0">
          {item.isExisting && item.iconUrl ? (
            <div className="w-8 h-8 overflow-hidden border border-gray-200 rounded">
              <img
                src={BASE_URL + item.iconUrl}
                alt={item.name}
                className="object-cover w-full h-full"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.classList.remove('hidden');
                }}
              />
              <ImageIcon className="hidden w-4 h-4 text-blue-600" />
            </div>
          ) : item.isExisting ? (
            <div className="flex items-center justify-center w-5 h-5 bg-blue-100 rounded">
              <span className="text-xs font-medium text-blue-600">E</span>
            </div>
          ) : item.file ? (
            <div className="flex items-center justify-center w-5 h-5 bg-green-100 rounded">
              <Plus className="w-3 h-3 text-green-600" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-5 h-5 bg-orange-100 rounded">
              <span className="text-xs font-medium text-orange-600">T</span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            type="text"
            value={item.name}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder="Enter amenity name (e.g., Swimming Pool)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {item.file && (
            <p className="mt-1 text-xs text-gray-500">
              {item.file.name} ({formatFileSize(item.file.size)})
            </p>
          )}
          {item.isNameOnly && <p className="mt-1 text-xs text-orange-600">Text-only amenity</p>}
          {item.isExisting && (
            <p className="mt-1 text-xs text-blue-600">
              Existing{item.iconUrl ? ' (with icon)' : ' (text-only)'}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="p-1 text-red-500 transition-colors rounded shrink-0 hover:text-red-700 hover:bg-red-50"
          title="Remove amenity"
          disabled={isSubmitting}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  },
);

AmenityItemRow.displayName = 'AmenityItemRow';

export default function AmenitiesSection({
  register,
  errors,
  iconDropzone,
  iconFiles,
  setIconFiles,
  removeAt,
  setValue,
  getValues,
  existingAmenities = [],
  onRemoveExisting,
  isSubmitting,
  syncAmenityItems,
}: AmenitiesSectionProps) {
  const [amenityItems, setAmenityItems] = useState<AmenityItem[]>([]);
  const prevMetadataRef = useRef<string>('');

  // Build amenity items from existing amenities and new uploads
  useEffect(() => {
    const items: AmenityItem[] = [];

    // Add existing amenities
    existingAmenities.forEach((amenity) => {
      items.push({
        id: amenity.id,
        name: amenity.name,
        isExisting: true,
        uniqueId: `existing-${amenity.id}`,
        iconUrl: amenity.iconUrl,
      });
    });

    // Add new uploaded files
    iconFiles.forEach((file, index) => {
      items.push({
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        file,
        fileIndex: index,
        isExisting: false,
        uniqueId: `new-${file.name}-${file.size}-${index}`,
      });
    });

    setAmenityItems(items);
  }, [existingAmenities, iconFiles]);

  // Sync with parent hook whenever amenityItems change
  // Use ref to prevent infinite loops by comparing stringified metadata
  useEffect(() => {
    const metadata = amenityItems.map((item) => ({
      id: item.id,
      name: item.name,
      hasIcon: !!item.file || !!item.iconUrl,
      iconFile: item.file,
    }));

    // Create a stable comparison key (excluding File objects which can't be compared)
    const metadataKey = JSON.stringify(
      metadata.map((m) => ({
        id: m.id,
        name: m.name,
        hasIcon: m.hasIcon,
        fileName: m.iconFile?.name,
        fileSize: m.iconFile?.size,
      })),
    );

    // Only sync if metadata actually changed
    if (metadataKey !== prevMetadataRef.current) {
      prevMetadataRef.current = metadataKey;

      if (syncAmenityItems) {
        syncAmenityItems(metadata);
      }

      // Update the hidden field for backward compatibility
      const names = amenityItems.map((item) => item.name.trim()).filter((n) => n);
      setValue?.('amenityNames', names.join(', '), { shouldValidate: false });
    }
  }, [amenityItems]); // Only depend on amenityItems, not syncAmenityItems or setValue

  const addNewAmenity = useCallback(() => {
    const newItem: AmenityItem = {
      name: '',
      isExisting: false,
      isNameOnly: true,
      uniqueId: `text-only-${Date.now()}-${Math.random()}`,
    };
    setAmenityItems((prev) => [...prev, newItem]);
  }, []);

  const updateAmenityName = useCallback((index: number, name: string) => {
    setAmenityItems((prev) => prev.map((item, i) => (i === index ? { ...item, name } : item)));
  }, []);

  const removeAmenityItem = useCallback(
    (index: number) => {
      const item = amenityItems[index];

      if (item.isExisting && item.id) {
        // Mark existing amenity for deletion
        onRemoveExisting?.(item.id);
      } else if (item.file && item.fileIndex !== undefined) {
        // Remove the uploaded file
        removeAt(item.fileIndex, iconFiles, setIconFiles, 'amenityIcons');
      }

      // Remove from local state
      setAmenityItems((prev) => prev.filter((_, i) => i !== index));
    },
    [amenityItems, iconFiles, removeAt, setIconFiles, onRemoveExisting],
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center mb-2 space-x-3">
        <div className="p-2 rounded-lg bg-green-50">
          <ImageIcon className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
          <p className="text-sm text-gray-600">Add amenities with optional icons</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Upload Amenity Icons (Optional)</h3>
          <span className="text-xs text-gray-500">JPG, PNG, WebP, SVG</span>
        </div>

        <FileUploadZone
          label=""
          dropzone={iconDropzone}
          files={iconFiles}
          onRemove={(idx) => {
            removeAt(idx, iconFiles, setIconFiles, 'amenityIcons');
          }}
          error={errors.amenityIcons}
          isSubmitting={isSubmitting}
        />

        <div className="p-3 mt-3 border border-blue-200 rounded-lg bg-blue-50">
          <p className="text-xs text-blue-800">
            <strong>How it works:</strong>
          </p>
          <ul className="mt-1 ml-4 space-y-1 text-xs text-blue-800 list-disc">
            <li>Upload icon images - each file will create an amenity with an icon</li>
            <li>Click "Add Amenity" below to create text-only amenities without icons</li>
            <li>Edit names for all amenities after adding them</li>
          </ul>
        </div>
      </div>

      {/* Amenity Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">
            Amenity List {amenityItems.length > 0 && `(${amenityItems.length})`}
          </h3>
          <button
            type="button"
            onClick={addNewAmenity}
            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 transition-colors border border-blue-200 rounded-md hover:bg-blue-50"
            disabled={isSubmitting}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Text-Only Amenity
          </button>
        </div>

        {amenityItems.length === 0 ? (
          <div className="py-8 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No amenities added yet</p>
            <p className="mt-1 text-xs">Upload icon files above or click "Add Text-Only Amenity"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {amenityItems.map((item, index) => (
              <AmenityItemRow
                key={item.uniqueId}
                item={item}
                index={index}
                onUpdate={updateAmenityName}
                onRemove={removeAmenityItem}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}

        {/* Hidden field for backward compatibility */}
        <input type="hidden" {...register('amenityNames')} />

        {errors.amenityNames && (
          <p className="mt-2 text-sm text-red-600">{errors.amenityNames.message}</p>
        )}
      </div>
    </div>
  );
}
