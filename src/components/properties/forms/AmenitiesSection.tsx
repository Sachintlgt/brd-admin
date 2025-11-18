// src/components/properties/forms/AmenitiesSection.tsx
import { formatFileSize } from '@/utils/fileValidation';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Sparkle } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

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
}

interface AmenityItem {
  id?: string;
  name: string;
  file?: File;
  isExisting?: boolean;
  uniqueId: string;
}

interface AmenityItemRowProps {
  item: AmenityItem;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const AmenityItemRow = memo(
  ({ item, index, onUpdate, onRemove, isSubmitting }: AmenityItemRowProps) => (
    <div className="flex items-center p-3 space-x-3 transition-all border-2 border-gray-200 rounded-lg bg-gradient-to-br from-green-50 to-white hover:border-green-300">
      <div className="shrink-0">
        {item.isExisting ? (
          <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg">
            <Sparkle className="w-4 h-4 text-green-600" />
          </div>
        ) : item.file ? (
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-lg">
            <Sparkle className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(index, e.target.value)}
          placeholder="Enter amenity name (e.g., Swimming Pool)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isSubmitting}
        />
        {item.file && (
          <p className="mt-1 text-xs text-gray-500">
            Icon: {item.file.name} ({formatFileSize(item.file.size)})
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
  ),
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

  useEffect(() => {
    setAmenityItems((prev) => {
      const updatedItems: AmenityItem[] = [];
      const previousMap = new Map(prev.map((item) => [item.uniqueId, item]));

      existingAmenities.forEach((amenity) => {
        updatedItems.push({
          id: amenity.id,
          name: amenity.name,
          isExisting: true,
          uniqueId: amenity.id || `existing-${amenity.id}`,
        });
      });

      iconFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        updatedItems.push({
          name: previousItem?.name || fileName,
          file,
          isExisting: false,
          uniqueId,
        });
      });

      return updatedItems;
    });
  }, [existingAmenities, iconFiles]);

  useEffect(() => {
    const names = amenityItems
      .filter((item) => item.name.trim() !== '')
      .map((item) => item.name.trim());
    const commaSeparatedNames = names.join(', ');
    setValue?.('amenityNames', commaSeparatedNames);
  }, [amenityItems, setValue]);

  const updateAmenityName = useCallback((index: number, name: string) => {
    setAmenityItems((prev) => prev.map((item, i) => (i === index ? { ...item, name } : item)));
  }, []);

  const removeAmenityItem = useCallback(
    (index: number) => {
      setAmenityItems((prev) => {
        const item = prev[index];

        if (item.isExisting && item.id) {
          onRemoveExisting?.(item.id);
        } else if (item.file) {
          const fileIndex = iconFiles.findIndex((f) => f === item.file);
          if (fileIndex !== -1) {
            removeAt(fileIndex, iconFiles, setIconFiles, 'amenityIcons');
          }
        }

        return prev.filter((_, i) => i !== index);
      });
    },
    [iconFiles, removeAt, setIconFiles, onRemoveExisting],
  );

  const addManualAmenity = () => {
    const newItem: AmenityItem = {
      name: '',
      isExisting: false,
      uniqueId: `manual-${Date.now()}`,
    };
    setAmenityItems((prev) => [...prev, newItem]);
  };

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-green-50">
            <Sparkle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Amenities</h2>
            <p className="text-sm text-gray-600">Add amenities with optional icons</p>
          </div>
        </div>
        <button
          type="button"
          onClick={addManualAmenity}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
        >
          <Plus className="w-4 h-4" />
          Add Amenity
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Upload Amenity Icons (Optional)</h3>
          <span className="text-xs text-gray-500">Max 50 • JPG, PNG, WebP, GIF, SVG</span>
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
            <strong>Note:</strong> Icons are optional. You can add amenities without icons using the
            "Add Amenity" button. File names will auto-populate as amenity names.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Amenity Details {amenityItems.length > 0 && `(${amenityItems.length})`}
        </h3>

        {amenityItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg">
            <Sparkle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No amenities added yet</p>
            <p className="text-xs">Upload icons or click "Add Amenity" to add manually</p>
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

        <input type="hidden" {...register('amenityNames')} />

        {errors.amenityNames && (
          <p className="mt-2 text-sm text-red-600">{errors.amenityNames.message}</p>
        )}
      </div>
    </div>
  );
}
