// src/components/properties/forms/HighlightsSection.tsx
import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2, Sparkles } from 'lucide-react';

interface HighlightsSectionProps {
  register: any;
  errors: any;
  control: any;
  getValues?: any;
  onRemoveExisting?: (id: string) => void;
  existingHighlights?: any[];
}

export default function HighlightsSection({
  register,
  errors,
  control,
  getValues,
  onRemoveExisting,
  existingHighlights = [],
}: HighlightsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights',
  });

  const addHighlight = () => {
    append({ key: '', label: '', value: '', displayOrder: fields.length + 1 });
  };

  const removeHighlight = (index: number) => {
    const highlight = getValues?.('highlights')?.[index];

    if (highlight?.id && onRemoveExisting) {
      onRemoveExisting(highlight.id);
    }

    remove(index);
  };

  const ExistingItem = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => (
    <div className="flex items-center justify-between px-4 py-3 transition-colors border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100">
      <div className="flex items-center flex-1 min-w-0 space-x-3">
        <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-indigo-900 truncate">{item.label}</p>
          <p className="text-xs text-indigo-700">{item.value}</p>
          <p className="mt-1 font-mono text-xs text-indigo-600">Key: {item.key}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="p-1 ml-2 text-red-500 transition-colors rounded hover:text-red-700 shrink-0 hover:bg-red-50"
        title="Remove highlight"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-50">
            <Sparkles className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Property Highlights</h2>
            <p className="text-sm text-gray-600">Add key features and statistics</p>
          </div>
        </div>
        <button
          type="button"
          onClick={addHighlight}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Add Highlight
        </button>
      </div>

      {existingHighlights.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs font-medium text-gray-600">Existing Highlights:</p>
          <div className="space-y-2 overflow-y-auto max-h-60">
            {existingHighlights.map((highlight) => (
              <ExistingItem
                key={highlight.id}
                item={highlight}
                onRemove={onRemoveExisting || (() => {})}
              />
            ))}
          </div>
        </div>
      )}

      {fields.length === 0 && existingHighlights.length === 0 && (
        <div className="py-12 text-center text-gray-500 border-2 border-gray-300 border-dashed rounded-lg">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm font-medium">No highlights added yet</p>
          <p className="text-xs">Click "Add Highlight" to showcase key property features</p>
        </div>
      )}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="p-5 transition-all border-2 border-gray-200 rounded-lg bg-gradient-to-br from-gray-50 to-white hover:border-indigo-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-full">
                  <span className="text-sm font-bold text-indigo-600">{index + 1}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-700">Highlight #{index + 1}</h3>
              </div>
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="p-2 text-red-600 transition-colors rounded-lg hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Key *{' '}
                  <span className="text-xs text-gray-500">(e.g., target_irr, roi, location)</span>
                </label>
                <input
                  type="text"
                  {...register(`highlights.${index}.key`)}
                  placeholder="e.g., target_irr"
                  className="w-full px-3 py-2 font-mono text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.highlights?.[index]?.key && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.highlights[index].key.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Label * <span className="text-xs text-gray-500">(Display name)</span>
                  </label>
                  <input
                    type="text"
                    {...register(`highlights.${index}.label`)}
                    placeholder="e.g., Target IRR"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.highlights?.[index]?.label && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.highlights[index].label.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Value * <span className="text-xs text-gray-500">(Actual value)</span>
                  </label>
                  <input
                    type="text"
                    {...register(`highlights.${index}.value`)}
                    placeholder="e.g., 12-15%"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {errors.highlights?.[index]?.value && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.highlights[index].value.message}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="hidden"
                {...register(`highlights.${index}.displayOrder`)}
                value={index + 1}
              />
            </div>
          </div>
        ))}
      </div>

      {errors.highlights?.root && (
        <div className="p-3 mt-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-sm text-red-600 whitespace-pre-wrap">
            {String(errors.highlights.root.message)}
          </p>
        </div>
      )}
    </div>
  );
}
