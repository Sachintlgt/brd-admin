import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface PricingDetailsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
}

export default function PricingDetailsSection({
  register,
  errors,
  setValue,
  getValues,
}: PricingDetailsSectionProps) {
  const [pricingDetails, setPricingDetails] = useState(getValues('pricingDetails') || []);

  const addPricing = () => {
    const newPricing = {
      label: '',
      price: '',
      type: 'ONE_TIME',
      phaseName: '',
      description: '',
      effectiveFrom: '',
      effectiveTo: '',
    };
    const updated = [...pricingDetails, newPricing];
    setPricingDetails(updated);
    setValue('pricingDetails', updated);
  };

  const removePricing = (index: number) => {
    const updated = pricingDetails.filter((_: any, i: number) => i !== index);
    setPricingDetails(updated);
    setValue('pricingDetails', updated);
  };

  const updatePricing = (index: number, field: string, value: any) => {
    const updated = [...pricingDetails];
    updated[index] = { ...updated[index], [field]: value };
    setPricingDetails(updated);
    setValue('pricingDetails', updated);
  };

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

      {pricingDetails.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No pricing details added. Click "Add Pricing" to create one.
        </p>
      )}

      <div className="space-y-6">
        {pricingDetails.map((pricing: any, index: number) => (
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
                  value={pricing.label}
                  onChange={(e) => updatePricing(index, 'label', e.target.value)}
                  placeholder="e.g., Phase 1, Standard Price"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Price *</label>
                <input
                  type="number"
                  value={pricing.price}
                  onChange={(e) => updatePricing(index, 'price', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Type *</label>
                <select
                  value={pricing.type}
                  onChange={(e) => updatePricing(index, 'type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ONE_TIME">One Time</option>
                  <option value="PHASE">Phase</option>
                </select>
              </div>

              {pricing.type === 'PHASE' && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Phase Name *
                  </label>
                  <input
                    type="text"
                    value={pricing.phaseName}
                    onChange={(e) => updatePricing(index, 'phaseName', e.target.value)}
                    placeholder="e.g., Early Bird Phase"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={pricing.description}
                  onChange={(e) => updatePricing(index, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe this pricing..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {pricing.type === 'PHASE' && (
                <>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Effective From *
                    </label>
                    <input
                      type="datetime-local"
                      value={pricing.effectiveFrom}
                      onChange={(e) => updatePricing(index, 'effectiveFrom', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Effective To *
                    </label>
                    <input
                      type="datetime-local"
                      value={pricing.effectiveTo}
                      onChange={(e) => updatePricing(index, 'effectiveTo', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {errors.pricingDetails && (
        <div className="mt-4">
          {Array.isArray(errors.pricingDetails.message) ? (
            <ul className="space-y-1 text-sm text-red-600">
              {errors.pricingDetails.message.map((msg: string, idx: number) => (
                <li key={idx}>• {msg}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {String(errors.pricingDetails.message)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
