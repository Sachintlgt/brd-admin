import { useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CurrencyInput from '../../ui/currencyInput';

interface ShareDetailsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  control: any;
  onRemoveExisting?: (id: string) => void;
  existingShareDetails?: any[];
}

export default function ShareDetailsSection({
  register,
  errors,
  setValue,
  getValues,
  control,
  onRemoveExisting,
  existingShareDetails = [],
}: ShareDetailsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shareDetails',
  });

  // Watch the share details to get current values for conditional rendering
  const watchedShareDetails = useWatch({
    control,
    name: 'shareDetails',
  });

  const addShareDetail = () => {
    append({
      title: '',
      description: '',
      shareCount: '',
      amount: '',
    });
  };

  const removeShareDetail = (index: number) => {
    const share = getValues('shareDetails')[index];

    // If it has an ID, it's an existing record
    if (share?.id && onRemoveExisting) {
      onRemoveExisting(share.id);
    }

    // Remove from field array
    remove(index);
  };

  const ExistingItem = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">{item.title || 'Untitled'}</p>
          <p className="text-xs text-gray-500">
            ₹ {item.amount || '0'} • {item.shareCount || 0} shares
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
        title="Remove share"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Share Details</h2>
        <button
          type="button"
          onClick={addShareDetail}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>

      {existingShareDetails.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Existing Share Packages:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {existingShareDetails.map((share) => (
              <ExistingItem key={share.id} item={share} onRemove={onRemoveExisting || (() => {})} />
            ))}
          </div>
        </div>
      )}

      {fields.length === 0 && existingShareDetails.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No share packages added. Click "Add Package" to create one.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Package #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeShareDetail(index)}
                className="text-red-600 transition-colors hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  {...register(`shareDetails.${index}.title`)}
                  placeholder="e.g., Basic Package"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.shareDetails?.[index]?.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shareDetails[index].title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Share Count</label>
                <input
                  type="number"
                  {...register(`shareDetails.${index}.shareCount`)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.shareDetails?.[index]?.shareCount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shareDetails[index].shareCount.message}
                  </p>
                )}
              </div>

              <div>
                <CurrencyInput
                  id={`share-amount-${index}`}
                  label="Amount"
                  placeholder="₹ 0"
                  inputProps={register(`shareDetails.${index}.amount`)}
                  error={errors.shareDetails?.[index]?.amount}
                />
                {errors.shareDetails?.[index]?.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shareDetails[index].amount.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register(`shareDetails.${index}.description`)}
                  rows={2}
                  placeholder="Describe this package..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.shareDetails?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shareDetails[index].description.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.shareDetails?.root && (
        <p className="text-sm text-red-600 whitespace-pre-wrap">
          {String(errors.shareDetails.root.message)}
        </p>
      )}
    </div>
  );
}
