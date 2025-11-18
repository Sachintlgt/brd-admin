import { formatFileSize } from '@/utils/fileValidation';
import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

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
  file?: File; // for new uploads
  isExisting?: boolean;
  uniqueId: string; // stable unique identifier for React keys
}

interface FloorPlanItemRowProps {
  item: FloorPlanItem;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const FloorPlanItemRow = memo(
  ({ item, index, onUpdate, onRemove, isSubmitting }: FloorPlanItemRowProps) => (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="shrink-0">
        {item.isExisting ? (
          <ImageIcon className="w-5 h-5 text-orange-600" />
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
          placeholder="Enter floor plan name (e.g., 3 BHK Layout)"
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
        title="Remove floor plan"
        disabled={isSubmitting}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ),
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
          isExisting: true,
          uniqueId: floorPlan.id || `existing-${floorPlan.id}`,
        });
      });

      // Add new uploaded files - preserve their names if they were entered before
      floorPlanImageFiles.forEach((file, index) => {
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
  useEffect(() => {
    const floorPlans = floorPlanItems
      .filter((item) => item.name.trim() !== '')
      .map((item, index) => ({
        name: item.name.trim(),
        imageUrl: 'will-be-uploaded',
        description: '', // Could be enhanced to include description field later
        displayOrder: index + 1,
      }));
    setValue?.('floorPlans', floorPlans);
  }, [floorPlanItems, setValue]);

  const updateFloorPlanName = useCallback((index: number, name: string) => {
    setFloorPlanItems((prev) => prev.map((item, i) => (i === index ? { ...item, name } : item)));
  }, []);

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

        <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs text-orange-800">
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
                onUpdate={updateFloorPlanName}
                onRemove={removeFloorPlanItem}
                isSubmitting={isSubmitting}
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
