// src/components/properties/forms/FloorPlansSection.tsx
import { formatFileSize } from '@/utils/fileValidation';
import FileUploadZone from '../FileUploadZone';
import { X, Plus, LayoutGrid, Image as ImageIcon } from 'lucide-react';
import { useEffect, useState, memo, useCallback } from 'react';

interface FloorPlansSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;
  floorPlanImageDropzone: any;
  floorPlanImageFiles: File[];
  setFloorPlanImageFiles: (f: File[]) => void;
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;
  existingFloorPlans?: any[];
  onRemoveExisting?: (id: string) => void;
  isSubmitting: boolean;
}

interface FloorPlanItem {
  id?: string;
  name: string;
  description: string;
  file?: File;
  isExisting?: boolean;
  uniqueId: string;
  displayOrder: number;
}

interface FloorPlanItemRowProps {
  item: FloorPlanItem;
  index: number;
  onUpdate: (index: number, field: 'name' | 'description', value: string) => void;
  onRemove: (index: number) => void;
  isSubmitting: boolean;
}

const FloorPlanItemRow = memo(
  ({ item, index, onUpdate, onRemove, isSubmitting }: FloorPlanItemRowProps) => (
    <div className="p-4 transition-all border-2 border-gray-200 rounded-lg bg-gradient-to-br from-orange-50 to-white hover:border-orange-300">
      <div className="flex items-start space-x-3">
        <div className="mt-1 shrink-0">
          {item.isExisting ? (
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-lg">
              <LayoutGrid className="w-5 h-5 text-orange-600" />
            </div>
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-green-600" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className="block mb-1 text-xs font-medium text-gray-700">
              Floor Plan Name * <span className="text-gray-500">(e.g., Ground Floor Layout)</span>
            </label>
            <input
              type="text"
              value={item.name}
              onChange={(e) => onUpdate(index, 'name', e.target.value)}
              placeholder="Enter floor plan name"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
              placeholder="Brief description of this floor plan"
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
          title="Remove floor plan"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
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

  useEffect(() => {
    setFloorPlanItems((prev) => {
      const updatedItems: FloorPlanItem[] = [];
      const previousMap = new Map(prev.map((item) => [item.uniqueId, item]));

      existingFloorPlans.forEach((floorPlan, idx) => {
        updatedItems.push({
          id: floorPlan.id,
          name: floorPlan.name || '',
          description: floorPlan.description || '',
          isExisting: true,
          uniqueId: floorPlan.id || `existing-${floorPlan.id}`,
          displayOrder: idx + 1,
        });
      });

      floorPlanImageFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        const fileName = file.name.replace(/\.[^/.]+$/, '');

        updatedItems.push({
          name: previousItem?.name || fileName,
          description: previousItem?.description || '',
          file,
          isExisting: false,
          uniqueId,
          displayOrder: existingFloorPlans.length + index + 1,
        });
      });

      return updatedItems;
    });
  }, [existingFloorPlans, floorPlanImageFiles]);

  useEffect(() => {
    const floorPlans = floorPlanItems
      .filter((item) => item.name.trim() !== '')
      .map((item) => ({
        name: item.name.trim(),
        description: item.description?.trim() || '',
        displayOrder: item.displayOrder,
      }));
    setValue?.('floorPlans', floorPlans);
  }, [floorPlanItems, setValue]);

  const updateFloorPlan = useCallback(
    (index: number, field: 'name' | 'description', value: string) => {
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
          onRemoveExisting?.(item.id);
        } else if (item.file) {
          const fileIndex = floorPlanImageFiles.findIndex((f) => f === item.file);
          if (fileIndex !== -1) {
            removeAt(fileIndex, floorPlanImageFiles, setFloorPlanImageFiles, 'floorPlanImages');
          }
        }

        return prev.filter((_, i) => i !== index);
      });
    },
    [floorPlanImageFiles, removeAt, setFloorPlanImageFiles, onRemoveExisting],
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center mb-6 space-x-3">
        <div className="p-2 rounded-lg bg-orange-50">
          <LayoutGrid className="w-6 h-6 text-orange-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Floor Plans</h2>
          <p className="text-sm text-gray-600">Add property floor layouts (images optional)</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Upload Floor Plan Images (Optional)</h3>
          <span className="text-xs text-gray-500">Max 10 • JPG, PNG, WebP, GIF</span>
        </div>

        <FileUploadZone
          label=""
          dropzone={floorPlanImageDropzone}
          files={floorPlanImageFiles}
          onRemove={(idx) => {
            removeAt(idx, floorPlanImageFiles, setFloorPlanImageFiles, 'floorPlanImages');
          }}
          error={errors.floorPlanImages}
          isSubmitting={isSubmitting}
        />

        <div className="p-3 mt-3 border border-orange-200 rounded-lg bg-orange-50">
          <p className="text-xs text-orange-800">
            <strong>Auto-naming:</strong> File names will be used as default floor plan names. You
            can edit them below.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700">
          Floor Plan Details {floorPlanItems.length > 0 && `(${floorPlanItems.length})`}
        </h3>

        {floorPlanItems.length === 0 ? (
          <div className="py-12 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg">
            <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium">No floor plans added yet</p>
            <p className="text-xs">Upload images or add floor plan details manually</p>
          </div>
        ) : (
          <div className="space-y-3">
            {floorPlanItems.map((item, index) => (
              <FloorPlanItemRow
                key={item.uniqueId}
                item={item}
                index={index}
                onUpdate={updateFloorPlan}
                onRemove={removeFloorPlanItem}
                isSubmitting={isSubmitting}
              />
            ))}
          </div>
        )}

        {errors.floorPlans && (
          <p className="mt-2 text-sm text-red-600">{errors.floorPlans.message}</p>
        )}
      </div>
    </div>
  );
}
