import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface ShareDetailsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
}

export default function ShareDetailsSection({
  register,
  errors,
  setValue,
  getValues,
}: ShareDetailsSectionProps) {
  const [shareDetails, setShareDetails] = useState(getValues('shareDetails') || []);

  const addShareDetail = () => {
    const newDetail = {
      title: '',
      description: '',
      shareCount: '',
      amount: '',
    };
    const updated = [...shareDetails, newDetail];
    setShareDetails(updated);
    setValue('shareDetails', updated);
  };

  const removeShareDetail = (index: number) => {
    const updated = shareDetails.filter((_: any, i: number) => i !== index);
    setShareDetails(updated);
    setValue('shareDetails', updated);
  };

  const updateShareDetail = (index: number, field: string, value: any) => {
    const updated = [...shareDetails];
    updated[index] = { ...updated[index], [field]: value };
    setShareDetails(updated);
    setValue('shareDetails', updated);
  };

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

      {shareDetails.length === 0 && (
        <p className="py-8 text-sm text-center text-gray-500">
          No share packages added. Click "Add Package" to create one.
        </p>
      )}

      <div className="space-y-6">
        {shareDetails.map((detail: any, index: number) => (
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
                  value={detail.title}
                  onChange={(e) => updateShareDetail(index, 'title', e.target.value)}
                  placeholder="e.g., Basic Package"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Share Count</label>
                <input
                  type="number"
                  value={detail.shareCount}
                  onChange={(e) => updateShareDetail(index, 'shareCount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={detail.amount}
                  onChange={(e) => updateShareDetail(index, 'amount', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={detail.description}
                  onChange={(e) => updateShareDetail(index, 'description', e.target.value)}
                  rows={2}
                  placeholder="Describe this package..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {errors.shareDetails && (
        <div className="mt-4">
          {Array.isArray(errors.shareDetails.message) ? (
            <ul className="space-y-1 text-sm text-red-600">
              {errors.shareDetails.message.map((msg: string, idx: number) => (
                <li key={idx}>• {msg}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600 whitespace-pre-wrap">
              {String(errors.shareDetails.message)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
