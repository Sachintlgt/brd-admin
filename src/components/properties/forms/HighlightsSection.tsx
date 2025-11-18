import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';

interface HighlightsSectionProps {
  register: any;
  errors: any;
  control: any;
  onRemoveExisting?: (id: string) => void;
  existingHighlights?: any[];
}

export default function HighlightsSection({
  register,
  errors,
  control,
  onRemoveExisting,
  existingHighlights = [],
}: HighlightsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights',
  });

  const addHighlight = () => {
    append({ key: '', label: '', value: '' });
  };

  const removeHighlight = (index: number) => {
    remove(index);
  };

  const ExistingItem = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">{item.label || 'Untitled'}</p>
          <p className="text-xs text-gray-500">{item.key} • {item.value}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
        title="Remove highlight"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Highlights</h2>
        <button
          type="button"
          onClick={addHighlight}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Highlight
        </button>
      </div>

      {existingHighlights.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Existing Highlights:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {existingHighlights.map((highlight) => (
              <ExistingItem key={highlight.id} item={highlight} onRemove={onRemoveExisting || (() => {})} />
            ))}
          </div>
        </div>
      )}

      {fields.length === 0 && existingHighlights.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No highlights added. Click "Add Highlight" to create one.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Highlight #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="text-red-600 transition-colors hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Key *</label>
                <input
                  type="text"
                  {...register(`highlights.${index}.key`)}
                  placeholder="e.g., Bedrooms"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.highlights?.[index]?.key && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.highlights[index].key.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Label *</label>
                <input
                  type="text"
                  {...register(`highlights.${index}.label`)}
                  placeholder="e.g., 3 Bedrooms"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.highlights?.[index]?.label && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.highlights[index].label.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Value *</label>
                <input
                  type="text"
                  {...register(`highlights.${index}.value`)}
                  placeholder="e.g., Spacious"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.highlights?.[index]?.value && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.highlights[index].value.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.highlights?.root && (
        <div className="mt-4">
          <p className="text-sm text-red-600 whitespace-pre-wrap">
            {String(errors.highlights.root.message)}
          </p>
        </div>
      )}
    </div>
  );
}
