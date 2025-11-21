import { formatFileSize } from '@/utils/fileValidation';
import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

// Helper to build full URLs
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface FloorPlansSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;

  // Images upload
  floorPlanImageDropzone: any;
  floorPlanImageFiles: File[];
  setFloorPlanImageFiles: (f: File[]) => void;

  // Helper
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;

  // Existing floor plans from DB
  existingFloorPlans?: any[];
  onRemoveExisting?: (id: string) => void; // removeExistingFloorPlan

  // Form submission
  isSubmitting: boolean;
}

interface FloorPlanItem {
  id?: string; // for existing floor plans
  name: string;
  description?: string;
  displayOrder?: number;
  file?: File; // for new uploads
  isExisting?: boolean;
  uniqueId: string; // stable unique identifier for React keys
}

interface FloorPlanItemRowProps {
  item: FloorPlanItem;
  index: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
  existingFloorPlans?: any[];
}

const FloorPlanItemRow = memo(
  ({
    item,
    index,
    onUpdate,
    onRemove,
    isSubmitting,
    existingFloorPlans = [],
  }: FloorPlanItemRowProps) => {
    // Find the corresponding existing floor plan to get the image URL
    const existingPlan =
      item.isExisting && existingFloorPlans.find((plan: any) => plan.id === item.id);

    return (
      <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              {item.isExisting ? (
                <ImageIcon className="w-5 h-5 text-orange-600" />
              ) : (
                <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                  <Plus className="w-3 h-3 text-green-600" />
                </div>
              )}
            </div>
            <h4 className="text-sm font-medium text-gray-700">Floor Plan #{index + 1}</h4>
          </div>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="shrink-0 text-red-600 hover:text-red-700 transition-colors"
            title="Remove floor plan"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Show floor plan image preview for existing floor plans */}
        {item.isExisting && existingPlan?.imageUrl && (
          <div className="mb-4">
            <div className="aspect-square max-w-32 mx-auto border border-gray-200 rounded-lg overflow-hidden">
              <img
                src={BASE_URL + existingPlan.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-image.png'; // Fallback
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="Enter floor plan name (e.g., 3 BHK Layout)"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
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
    );
  },
);

FloorPlanItemRow.displayName = 'FloorPlanItemRow';

export default function FloorPlansSection({
  register,
  errors,
  floorPlanImageDropzone,
  floorPlanImageFiles,
  setFloorPlanImageFiles,
  removeAt,
  setValue,
  getValues,
  existingFloorPlans = [],
  onRemoveExisting,
  isSubmitting,
}: FloorPlansSectionProps) {
  const [floorPlanItems, setFloorPlanItems] = useState<FloorPlanItem[]>([]);

  // Initialize floor plan items when component mounts or existing floor plans change
  useEffect(() => {
    setFloorPlanItems((prev) => {
      const updatedItems: FloorPlanItem[] = [];
      const previousMap = new Map(prev.map((item) => [item.uniqueId, item]));

      // Add existing floor plans
      existingFloorPlans.forEach((floorPlan) => {
        updatedItems.push({
          id: floorPlan.id,
          name: floorPlan.name,
          description: floorPlan.description,
          displayOrder: floorPlan.displayOrder,
          isExisting: true,
          uniqueId: floorPlan.id || `existing-${floorPlan.id}`,
        });
      });

      // Add new uploaded files - preserve their data if they were entered before
      floorPlanImageFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        updatedItems.push({
          name: previousItem?.name || '',
          description: previousItem?.description || '',
          file,
          isExisting: false,
          uniqueId,
        });
      });

      return updatedItems;
    });
  }, [existingFloorPlans, floorPlanImageFiles]);

  // Update floorPlanNames whenever floorPlanItems change
  useEffect(() => {
    const names = floorPlanItems
      .filter((item) => item.name.trim() !== '')
      .map((item) => item.name.trim());
    const commaSeparatedNames = names.join(', ');
    setValue?.('floorPlanNames', commaSeparatedNames);
  }, [floorPlanItems, setValue]);

  // Update floorPlans array whenever floorPlanItems change
  // IMPORTANT: Only include NEW floor plans (without id) that need images uploaded
  // Existing floor plans are already in the database and should not be included
  // displayOrder will be assigned automatically in usePropertyForm when sending to backend
  useEffect(() => {
    const floorPlans = floorPlanItems
      .filter((item) => item.name.trim() !== '' && !item.isExisting)
      .map((item) => ({
        name: item.name.trim(),
        description: item.description?.trim() || undefined,
      }));
    setValue?.('floorPlans', floorPlans);
  }, [floorPlanItems, setValue]);

  const updateFloorPlanItem = useCallback(
    (index: number, field: string, value: string | number) => {
      setFloorPlanItems((prev) =>
        prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
      );
    },
    [],
  );

  const removeFloorPlanItem = useCallback(
    (index: number) => {
      setFloorPlanItems((prev) => {
        const item = prev[index];

        if (item.isExisting && item.id) {
          // Remove existing floor plan
          onRemoveExisting?.(item.id);
        } else if (item.file) {
          // Remove new uploaded file
          const fileIndex = floorPlanImageFiles.findIndex((f) => f === item.file);
          if (fileIndex !== -1) {
            removeAt(fileIndex, floorPlanImageFiles, setFloorPlanImageFiles, 'floorPlanImages');
          }
        }

        // Remove from local state
        return prev.filter((_, i) => i !== index);
      });
    },
    [floorPlanImageFiles, removeAt, setFloorPlanImageFiles, onRemoveExisting],
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-orange-50 rounded-lg">
          <ImageIcon className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Floor Plans</h2>
          <p className="text-sm text-gray-600">Add floor plans with optional images</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Upload Floor Plan Images</h3>
          <span className="text-xs text-gray-500">Max 20 • JPG, PNG, WebP, GIF</span>
        </div>

        <FileUploadZone
          label=""
          dropzone={floorPlanImageDropzone}
          files={floorPlanImageFiles}
          onRemove={(idx) => {
            // Remove from files array, the useEffect will handle updating floorPlanItems
            removeAt(idx, floorPlanImageFiles, setFloorPlanImageFiles, 'floorPlanImages');
          }}
          error={errors.floorPlanImages}
          isSubmitting={isSubmitting}
        />

        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Tip:</strong> Upload floor plan images first, then enter the floor plan names
            below for each one.
          </p>
        </div>
      </div>

      {/* Floor Plan Items */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Floor Plan Details {floorPlanItems.length > 0 && `(${floorPlanItems.length})`}
        </h3>

        {floorPlanItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No floor plans added yet</p>
            <p className="text-xs">Upload floor plan images above to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            {floorPlanItems.map((item, index) => (
              <FloorPlanItemRow
                key={item.uniqueId}
                item={item}
                index={index}
                onUpdate={updateFloorPlanItem}
                onRemove={removeFloorPlanItem}
                isSubmitting={isSubmitting}
                existingFloorPlans={existingFloorPlans}
              />
            ))}
          </div>
        )}

        {/* Hidden field for comma-separated names (for backend compatibility) */}
        <input type="hidden" {...register('floorPlanNames')} />

        {errors.floorPlanNames && (
          <p className="mt-2 text-sm text-red-600">{errors.floorPlanNames.message}</p>
        )}
      </div>
    </div>
  );
}
