import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CurrencyInput from '../../ui/currencyInput';

interface PaymentPlansSectionProps {
  register: any;
  errors: any;
  control: any;
  getValues?: any;
  onRemoveExisting?: (id: string) => void;
}

export default function PaymentPlansSection({
  register,
  errors,
  control,
  getValues,
  onRemoveExisting,
}: PaymentPlansSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paymentPlans',
  });

  const addPaymentPlan = () => {
    append({
      planType: 'INSTALMENT',
      purchaseType: 'WHOLE_UNIT',
      name: '',
      description: '',
      amount: '',
      percentage: '',
      milestone: '',
      dueDate: '',
      isGSTIncluded: false,
      gstPercentage: '',
    });
  };

  const removePaymentPlan = (index: number) => {
    const currentValues = getValues?.('paymentPlans') || [];
    const item = currentValues[index];

    if (item?.isExisting && item?.id && onRemoveExisting) {
      // This is an existing item - use the removeExisting function
      onRemoveExisting(item.id);
    } else {
      // This is a new item - just remove from form
      remove(index);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Payment Plans</h2>
        <button
          type="button"
          onClick={addPaymentPlan}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Payment Plan
        </button>
      </div>

      {fields.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No payment plans added. Click "Add Payment Plan" to create one.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Payment Plan #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removePaymentPlan(index)}
                className="text-red-600 transition-colors hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Plan Type *</label>
                <select
                  {...register(`paymentPlans.${index}.planType`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="INSTALMENT">Instalment</option>
                  <option value="BIFURCATION">Bifurcation</option>
                </select>
                {errors.paymentPlans?.[index]?.planType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentPlans[index].planType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Purchase Type *
                </label>
                <select
                  {...register(`paymentPlans.${index}.purchaseType`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="WHOLE_UNIT">Whole Unit</option>
                  <option value="FRACTIONAL">Fractional</option>
                </select>
                {errors.paymentPlans?.[index]?.purchaseType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentPlans[index].purchaseType.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Name *</label>
                <input
                  type="text"
                  {...register(`paymentPlans.${index}.name`)}
                  placeholder="e.g., Down Payment"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.paymentPlans?.[index]?.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentPlans[index].name.message}
                  </p>
                )}
              </div>

              <div>
                <CurrencyInput
                  id={`payment-amount-${index}`}
                  label="Amount *"
                  placeholder="₹ 0"
                  inputProps={register(`paymentPlans.${index}.amount`)}
                  error={errors.paymentPlans?.[index]?.amount}
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Percentage (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  {...register(`paymentPlans.${index}.percentage`)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.paymentPlans?.[index]?.percentage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentPlans[index].percentage.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Milestone</label>
                <input
                  type="text"
                  {...register(`paymentPlans.${index}.milestone`)}
                  placeholder="e.g., Upon Booking"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.paymentPlans?.[index]?.milestone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentPlans[index].milestone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  {...register(`paymentPlans.${index}.dueDate`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.paymentPlans?.[index]?.dueDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.paymentPlans[index].dueDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* GST Configuration */}
            <div className="mt-6">
              <div className="flex items-center space-x-3 mb-4">
                <input
                  type="checkbox"
                  {...register(`paymentPlans.${index}.isGSTIncluded`)}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label className="text-sm font-medium text-gray-700">Include GST</label>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    GST Percentage {errors.paymentPlans?.[index]?.isGSTIncluded ? '*' : ''}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    {...register(`paymentPlans.${index}.gstPercentage`)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.paymentPlans?.[index]?.gstPercentage && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.paymentPlans[index].gstPercentage.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register(`paymentPlans.${index}.description`)}
                rows={3}
                placeholder="Optional description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={500}
              />
              {errors.paymentPlans?.[index]?.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.paymentPlans[index].description.message}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.paymentPlans?.root && (
        <div className="mt-4">
          <p className="text-sm text-red-600 whitespace-pre-wrap">
            {String(errors.paymentPlans.root.message)}
          </p>
        </div>
      )}
    </div>
  );
}
