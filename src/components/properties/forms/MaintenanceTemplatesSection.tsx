import { useFieldArray, useWatch } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import CurrencyInput from '../../ui/currencyInput';

interface MaintenanceTemplatesSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  control: any;
  onRemoveExisting?: (id: string) => void;
}

export default function MaintenanceTemplatesSection({
  register,
  errors,
  setValue,
  getValues,
  control,
  onRemoveExisting,
}: MaintenanceTemplatesSectionProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'maintenanceTemplates',
  });

  // Watch the maintenance templates to get current values for conditional rendering
  const watchedTemplates = useWatch({
    control,
    name: 'maintenanceTemplates',
  });

  const addTemplate = () => {
    append({
      chargeType: 'MONTHLY',
      amount: '',
      description: '',
      dueDay: '',
      startDate: '',
      endDate: '',
      isActive: true,
    });
  };

  const removeTemplate = (index: number) => {
    const currentValues = getValues('maintenanceTemplates') || [];
    const item = currentValues[index];

    if (item?.isExisting && item?.id && onRemoveExisting) {
      // This is an existing item - use the removeExisting function
      onRemoveExisting(item.id);
    } else {
      // This is a new item - just remove from form
      remove(index);
    }
  };

  const isRecurring = (type: string) => {
    return ['MONTHLY', 'QUARTERLY', 'YEARLY'].includes(type);
  };

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Maintenance Templates</h2>
        <button
          type="button"
          onClick={addTemplate}
          className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Template
        </button>
      </div>

      {fields.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No maintenance templates added. Click "Add Template" to create one.
        </p>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-700">Template #{index + 1}</h3>
              <button
                type="button"
                onClick={() => removeTemplate(index)}
                className="text-red-600 transition-colors hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Charge Type *
                </label>
                <select
                  {...register(`maintenanceTemplates.${index}.chargeType`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="ONE_TIME">One Time</option>
                </select>
                {errors.maintenanceTemplates?.[index]?.chargeType && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maintenanceTemplates[index].chargeType.message}
                  </p>
                )}
              </div>

              <div>
                <CurrencyInput
                  id={`maintenance-amount-${index}`}
                  label="Amount *"
                  placeholder="₹ 0"
                  inputProps={register(`maintenanceTemplates.${index}.amount`)}
                  error={errors.maintenanceTemplates?.[index]?.amount}
                />
              </div>

              {isRecurring(watchedTemplates?.[index]?.chargeType || 'MONTHLY') && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Due Day (1-31) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    {...register(`maintenanceTemplates.${index}.dueDay`)}
                    placeholder="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.maintenanceTemplates?.[index]?.dueDay && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.maintenanceTemplates[index].dueDay.message}
                    </p>
                  )}
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  {...register(`maintenanceTemplates.${index}.startDate`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.maintenanceTemplates?.[index]?.startDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maintenanceTemplates[index].startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  {...register(`maintenanceTemplates.${index}.endDate`)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.maintenanceTemplates?.[index]?.endDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maintenanceTemplates[index].endDate.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register(`maintenanceTemplates.${index}.description`)}
                  rows={2}
                  placeholder="Describe this maintenance charge..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.maintenanceTemplates?.[index]?.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maintenanceTemplates[index].description.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(`maintenanceTemplates.${index}.isActive`)}
                    className="text-blue-600 border-gray-300 rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                {errors.maintenanceTemplates?.[index]?.isActive && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.maintenanceTemplates[index].isActive.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.maintenanceTemplates?.root && (
        <div className="mt-4">
          <p className="text-sm text-red-600 whitespace-pre-wrap">
            {String(errors.maintenanceTemplates.root.message)}
          </p>
        </div>
      )}
    </div>
  );
}
