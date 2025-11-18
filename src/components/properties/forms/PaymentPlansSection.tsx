import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CurrencyInput from '../../ui/currencyInput';

interface PaymentPlansSectionProps {
  register: any;
  errors: any;
  control: any;
  getValues?: any;
  onRemoveExisting?: (id: string) => void;
  existingPaymentPlans?: any[];
}

export default function PaymentPlansSection({
  register,
  errors,
  control,
  getValues,
  onRemoveExisting,
  existingPaymentPlans = [],
}: PaymentPlansSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paymentPlans',
  });

  const addPaymentPlan = () => {
    append({ planType: 'INSTALMENT', name: '', amount: '', purchaseType: 'WHOLE_UNIT' });
  };

  const removePaymentPlan = (index: number) => {
    const plan = getValues?.('paymentPlans')?.[index];

    // If it has an ID, it's an existing record
    if (plan?.id && onRemoveExisting) {
      onRemoveExisting(plan.id);
    }

    remove(index);
  };

  const ExistingItem = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">{item.name || 'Untitled'}</p>
          <p className="text-xs text-gray-500">
            ₹ {item.amount || '0'} • {item.planType} • {item.purchaseType}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
        title="Remove payment plan"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

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

      {existingPaymentPlans.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-xs text-gray-600 font-medium">Existing Payment Plans:</p>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {existingPaymentPlans.map((plan) => (
              <ExistingItem key={plan.id} item={plan} onRemove={onRemoveExisting || (() => {})} />
            ))}
          </div>
        </div>
      )}

      {fields.length === 0 && existingPaymentPlans.length === 0 && (
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
