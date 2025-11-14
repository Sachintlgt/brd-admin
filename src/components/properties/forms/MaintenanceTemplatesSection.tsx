import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface MaintenanceTemplatesSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
}

export default function MaintenanceTemplatesSection({
  register,
  errors,
  setValue,
  getValues,
}: MaintenanceTemplatesSectionProps) {
  const [templates, setTemplates] = useState(getValues('maintenanceTemplates') || []);

  const addTemplate = () => {
    const newTemplate = {
      chargeType: 'MONTHLY',
      amount: '',
      description: '',
      dueDay: '',
      startDate: '',
      endDate: '',
      isActive: true,
    };
    const updated = [...templates, newTemplate];
    setTemplates(updated);
    setValue('maintenanceTemplates', updated);
  };

  const removeTemplate = (index: number) => {
    const updated = templates.filter((_: any, i: number) => i !== index);
    setTemplates(updated);
    setValue('maintenanceTemplates', updated);
  };

  const updateTemplate = (index: number, field: string, value: any) => {
    const updated = [...templates];
    updated[index] = { ...updated[index], [field]: value };
    setTemplates(updated);
    setValue('maintenanceTemplates', updated);
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

      {templates.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No maintenance templates added. Click "Add Template" to create one.
        </p>
      )}

      <div className="space-y-6">
        {templates.map((template: any, index: number) => (
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
                  value={template.chargeType}
                  onChange={(e) => updateTemplate(index, 'chargeType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                  <option value="ONE_TIME">One Time</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Amount *</label>
                <input
                  type="number"
                  value={template.amount}
                  onChange={(e) => updateTemplate(index, 'amount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {isRecurring(template.chargeType) && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Due Day (1-31) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={template.dueDay}
                    onChange={(e) => updateTemplate(index, 'dueDay', e.target.value)}
                    placeholder="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="datetime-local"
                  value={template.startDate}
                  onChange={(e) => updateTemplate(index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="datetime-local"
                  value={template.endDate}
                  onChange={(e) => updateTemplate(index, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={template.description}
                  onChange={(e) => updateTemplate(index, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe this maintenance charge..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={template.isActive}
                    onChange={(e) => updateTemplate(index, 'isActive', e.target.checked)}
                    className="text-blue-600 border-gray-300 rounded shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.maintenanceTemplates && (
        <div className="mt-4">
          {Array.isArray(errors.maintenanceTemplates.message) ? (
            <ul className="space-y-1 text-sm text-red-600">
              {errors.maintenanceTemplates.message.map((msg: string, idx: number) => (
                <li key={idx}>• {msg}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {String(errors.maintenanceTemplates.message)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
