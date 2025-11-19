import { Controller } from 'react-hook-form';
import FormInput from '../../ui/propertiesFormInput';
import FreeLocationPicker from '@/components/common/FreeLocationPicker';

interface BasicInformationSectionProps {
  register: any;
  errors: any;
  control: any;
}

export default function BasicInformationSection({
  register,
  errors,
  control,
}: BasicInformationSectionProps) {
  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Basic Information</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          id="name"
          label="Property Name *"
          placeholder="Enter property name"
          inputProps={register('name')}
          error={errors.name}
        />
        <FormInput
          id="location"
          label="Location *"
          placeholder="Enter property location"
          inputProps={register('location')}
          error={errors.location}
        />
      </div>

      <div className="mt-6">
        <Controller
          name="googleLocation"
          control={control}
          render={({ field }) => (
            <FreeLocationPicker
              id="googleLocation"
              label="Location *"
              value={field.value}
              onChange={field.onChange}
              error={errors.googleLocation}
              placeholder="Search for property location..."
            />
          )}
        />
      </div>

      <div className="mt-6">
        <label className="block mb-2 text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 transition-colors duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe the property..."
        />
        {errors.description && (
          <p className="mt-2 text-sm text-red-600">{String(errors.description.message)}</p>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Property Details</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            id="beds"
            label="Beds"
            type="number"
            placeholder="0"
            inputProps={register('beds')}
            error={errors.beds}
          />
          <FormInput
            id="bathrooms"
            label="Bathrooms"
            type="number"
            placeholder="0"
            inputProps={register('bathrooms')}
            error={errors.bathrooms}
          />
          <FormInput
            id="sqft"
            label="Sqft"
            type="number"
            placeholder="0"
            inputProps={register('sqft')}
            error={errors.sqft}
          />
          <FormInput
            id="maxOccupancy"
            label="Max Occupancy"
            placeholder="e.g., 6-8 guests"
            inputProps={register('maxOccupancy')}
            error={errors.maxOccupancy}
          />
        </div>
      </div>
    </div>
  );
}
