import FormInput from "../../ui/propertiesFormInput";

interface BasicInformationSectionProps {
  register: any;
  errors: any;
}

export default function BasicInformationSection({
  register,
  errors,
}: BasicInformationSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Basic Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="name"
          label="Property Name *"
          placeholder="Enter property name"
          inputProps={register("name")}
          error={errors.name}
        />
        <FormInput
          id="location"
          label="Location *"
          placeholder="Enter property location"
          inputProps={register("location")}
          error={errors.location}
        />
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
          placeholder="Describe the property..."
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">
            {String(errors.description.message)}
          </p>
        )}
      </div>
    </div>
  );
}
