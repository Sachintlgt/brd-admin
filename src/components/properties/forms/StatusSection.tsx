interface StatusSectionProps {
  register: any;
  errors: any;
}

export default function StatusSection({ register, errors }: StatusSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Status</h2>
      <div className="mt-2 flex items-center space-x-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isActive')}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-3 text-sm text-gray-700">Active Property</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isFeatured')}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="ml-3 text-sm text-gray-700">Featured Property</span>
        </label>
      </div>
      {(errors.isActive || errors.isFeatured) && (
        <p className="mt-2 text-sm text-red-600">
          {errors.isActive?.message || errors.isFeatured?.message}
        </p>
      )}
    </div>
  );
}
