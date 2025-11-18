import { useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CurrencyInput from '../../ui/currencyInput';

interface PricingDetailsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  control: any;
  onRemoveExisting?: (id: string) => void;
  existingPricingDetails?: any[];
}

export default function PricingDetailsSection({
  register,
  errors,
  setValue,
  getValues,
  control,
  onRemoveExisting,
  existingPricingDetails = [],
}: PricingDetailsSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pricingDetails',
  });

  // Watch the pricing details to get current values for conditional rendering
  const watchedPricingDetails = useWatch({
    control,
    name: 'pricingDetails',
  });

  const addPricing = () => {
    append({
      label: '',
      price: '',
      type: 'ONE_TIME',
      phaseName: '',
      description: '',
      effectiveFrom: '',
      effectiveTo: '',
    });
  };

  const removePricing = (index: number) => {
    const pricing = getValues('pricingDetails')[index];

    // If it has an ID, it's an existing record
    if (pricing?.id && onRemoveExisting) {
      onRemoveExisting(pricing.id);
    }

    // Remove from field array
    remove(index);
  };

  const ExistingItem = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">{item.label || 'Untitled'}</p>
          <p className="text-xs text-gray-500">₹ {item.price || '0'} • {item.type}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
        title="Remove pricing"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Pricing Details</h2>
        <button
          type="button"
          onClick={addPricing}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Pricing
        </button>
      </div>

      {existingPricingDetails.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Existing Pricing:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {existingPricingDetails.map((pricing) => (
              <ExistingItem key={pricing.id} item={pricing} onRemove={onRemoveExisting || (() => {})} />
            ))}
          </div>
        </div>
      )}

      {fields.length === 0 && existingPricingDetails.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No pricing details added. Click "Add Pricing" to create one.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Pricing #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removePricing(index)}
                className="text-red-600 transition-colors hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Label *</label>
                <input
                  type="text"
                  {...register(`pricingDetails.${index}.label`)}
                  placeholder="e.g., Phase 1, Standard Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  error={errors.pricingDetails?.[index]?.label}
                />
                {errors.pricingDetails?.[index]?.label && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pricingDetails[index].label.message}
                  </p>
                )}
              </div>

              <div>
                <CurrencyInput
                  id={`pricing-price-${index}`}
                  label="Price *"
                  placeholder="₹ 0"
                  inputProps={register(`pricingDetails.${index}.price`)}
                  error={errors.pricingDetails?.[index]?.price}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Type *</label>
                <select
                  {...register(`pricingDetails.${index}.type`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  error={errors.pricingDetails?.[index]?.type}
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="PHASE">Phase</option>
                </select>
                {errors.pricingDetails?.[index]?.type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pricingDetails[index].type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Phase Name *
                </label>
                <input
                  type="text"
                  {...register(`pricingDetails.${index}.phaseName`)}
                  placeholder="e.g., Early Bird Phase"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  error={errors.pricingDetails?.[index]?.phaseName}
                />
                {errors.pricingDetails?.[index]?.phaseName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pricingDetails[index].phaseName.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register(`pricingDetails.${index}.description`)}
                  rows={2}
                  placeholder="Describe this pricing..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  error={errors.pricingDetails?.[index]?.description}
                />
                {errors.pricingDetails?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.pricingDetails[index].description.message}
                  </p>
                )}
              </div>

              {(watchedPricingDetails?.[index]?.type === 'PHASE') && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Effective From *
                    </label>
                    <input
                      type="datetime-local"
                      {...register(`pricingDetails.${index}.effectiveFrom`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      error={errors.pricingDetails?.[index]?.effectiveFrom}
                    />
                    {errors.pricingDetails?.[index]?.effectiveFrom && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pricingDetails[index].effectiveFrom.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Effective To *
                    </label>
                    <input
                      type="datetime-local"
                      {...register(`pricingDetails.${index}.effectiveTo`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      error={errors.pricingDetails?.[index]?.effectiveTo}
                    />
                    {errors.pricingDetails?.[index]?.effectiveTo && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.pricingDetails[index].effectiveTo.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.pricingDetails?.root && (
        <div className="mt-4">
          <p className="text-sm text-red-600 whitespace-pre-wrap">
            {String(errors.pricingDetails.root.message)}
          </p>
        </div>
      )}
    </div>
  );
}
