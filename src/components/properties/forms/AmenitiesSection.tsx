import { formatFileSize } from '@/utils/fileValidation';
import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface AmenitiesSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;

  // Icons upload
  iconDropzone: any;
  iconFiles: File[];
  setIconFiles: (f: File[]) => void;

  // Helper
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;

  // Existing amenities from DB
  existingAmenities?: any[];
  onRemoveExisting?: (id: string) => void; // removeExistingAmenity

  // Form submission
  isSubmitting: boolean;
}

interface AmenityItem {
  id?: string; // for existing amenities
  name: string;
  file?: File; // for new uploads
  isExisting?: boolean;
  uniqueId: string; // stable unique identifier for React keys
  isNameOnly?: boolean; // for amenities added manually without images
}

interface AmenityItemRowProps {
  item: AmenityItem;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
  existingAmenities?: any[];
}

const AmenityItemRow = memo(
  ({
    item,
    index,
    onUpdate,
    onRemove,
    isSubmitting,
    existingAmenities = [],
  }: AmenityItemRowProps) => {
    // Find the corresponding existing amenity to get the icon URL
    const existingAmenity =
      item.isExisting && existingAmenities.find((amenity: any) => amenity.id === item.id);

    return (
      <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
        <div className="shrink-0">
          {item.isExisting && existingAmenity?.iconUrl ? (
            <div className="w-8 h-8 border border-gray-200 rounded overflow-hidden">
              <img
                src={BASE_URL + existingAmenity.iconUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <ImageIcon className="w-4 h-4 text-blue-600 hidden" />
            </div>
          ) : item.isExisting ? (
            <ImageIcon className="w-5 h-5 text-blue-600" />
          ) : item.isNameOnly ? (
            <div className="w-5 h-5 bg-orange-100 rounded flex items-center justify-center">
              <span className="text-xs font-medium text-orange-600">T</span>
            </div>
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
            placeholder="Enter amenity name (e.g., Swimming Pool)"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          {item.file && (
            <p className="text-xs text-gray-500 mt-1">
              {item.file.name} ({formatFileSize(item.file.size)})
            </p>
          )}
          {item.isNameOnly && <p className="text-xs text-orange-600 mt-1">Name only (no image)</p>}
          {item.isExisting && <p className="text-xs text-blue-600 mt-1">Existing amenity</p>}
        </div>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
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
}: AmenitiesSectionProps) {
  const [amenityItems, setAmenityItems] = useState<AmenityItem[]>([]);

  // Parse amenity names from the form field
  const parseAmenityNames = (amenityNamesStr: string): string[] => {
    if (!amenityNamesStr) return [];
    return amenityNamesStr
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  // Initialize amenity items when component mounts or existing amenities change
  useEffect(() => {
    const currentAmenityNamesStr = getValues('amenityNames') || '';
    const amenityNames = parseAmenityNames(currentAmenityNamesStr);

    setAmenityItems((prev) => {
      const updatedItems: AmenityItem[] = [];
      const previousMap = new Map(prev.map((item) => [item.uniqueId, item]));

      // Add existing amenities first
      existingAmenities.forEach((amenity) => {
        updatedItems.push({
          id: amenity.id,
          name: amenity.name,
          isExisting: true,
          uniqueId: amenity.id || `existing-${amenity.id}`,
        });
      });

      // Add new uploaded files - preserve their names if they were entered before
      iconFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        updatedItems.push({
          name: previousItem?.name || '', // Preserve previous name if it exists
          file,
          isExisting: false,
          uniqueId,
        });
      });

      // Add name-only amenities (from the amenityNames field, excluding existing amenities)
      const existingNamesSet = new Set(updatedItems.map((item) => item.name));
      amenityNames.forEach((name) => {
        if (name.trim() && !existingNamesSet.has(name)) {
          const uniqueId = `name-only-${name}`;
          const previousItem = previousMap.get(uniqueId);
          updatedItems.push({
            name,
            isExisting: false,
            isNameOnly: true,
            uniqueId,
          });
        }
      });

      return updatedItems;
    });
  }, [existingAmenities, iconFiles, getValues]);

  // Update amenityNames whenever amenityItems change
  useEffect(() => {
    const names = amenityItems
      .filter((item) => item.name.trim() !== '')
      .map((item) => item.name.trim());
    const commaSeparatedNames = names.join(', ');
    setValue?.('amenityNames', commaSeparatedNames);
  }, [amenityItems, setValue]);

  // Add a new amenity name manually
  const addNewAmenity = useCallback(() => {
    const newItem: AmenityItem = {
      name: '',
      isExisting: false,
      isNameOnly: true,
      uniqueId: `name-only-new-${Date.now()}-${Math.random()}`,
    };
    setAmenityItems((prev) => [...prev, newItem]);
  }, []);

  const updateAmenityName = useCallback((index: number, name: string) => {
    setAmenityItems((prev) => prev.map((item, i) => (i === index ? { ...item, name } : item)));
  }, []);

  const removeAmenityItem = useCallback(
    (index: number) => {
      setAmenityItems((prev) => {
        const item = prev[index];

        if (item.isExisting && item.id) {
          // Remove existing amenity
          onRemoveExisting?.(item.id);
        } else if (item.file) {
          // Remove new uploaded file
          const fileIndex = iconFiles.findIndex((f) => f === item.file);
          if (fileIndex !== -1) {
            removeAt(fileIndex, iconFiles, setIconFiles, 'amenityIcons');
          }
        }
        // For name-only amenities, just remove from local state (no additional cleanup needed)

        // Remove from local state
        return prev.filter((_, i) => i !== index);
      });
    },
    [iconFiles, removeAt, setIconFiles, onRemoveExisting],
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-green-50 rounded-lg">
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
          <h3 className="text-sm font-medium text-gray-700">Upload Amenity Icons</h3>
          <span className="text-xs text-gray-500">Max 50 • JPG, PNG, WebP, GIF</span>
        </div>

        <FileUploadZone
          label=""
          dropzone={iconDropzone}
          files={iconFiles}
          onRemove={(idx) => {
            // Remove from files array, the useEffect will handle updating amenityItems
            removeAt(idx, iconFiles, setIconFiles, 'amenityIcons');
          }}
          error={errors.amenityIcons}
          isSubmitting={isSubmitting}
        />

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Upload icon images if you want to associate them with amenities,
            or just add amenity names manually below. You can mix amenities with and without images.
          </p>
        </div>
      </div>

      {/* Amenity Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">
            Amenity Details {amenityItems.length > 0 && `(${amenityItems.length})`}
          </h3>
          <button
            type="button"
            onClick={addNewAmenity}
            className="inline-flex items-center px-3 py-1 text-sm text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
            disabled={isSubmitting}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Amenity
          </button>
        </div>

        {amenityItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No amenities added yet</p>
            <p className="text-xs">Upload icon files above or click "Add Amenity" to get started</p>
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
                existingAmenities={existingAmenities}
              />
            ))}
          </div>
        )}

        {/* Hidden field for comma-separated names (for backend compatibility) */}
        <input type="hidden" {...register('amenityNames')} />

        {errors.amenityNames && (
          <p className="mt-2 text-sm text-red-600">{errors.amenityNames.message}</p>
        )}
      </div>
    </div>
  );
}
