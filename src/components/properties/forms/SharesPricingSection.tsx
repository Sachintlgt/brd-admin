import FormInput from '../../ui/propertiesFormInput';

interface SharesPricingSectionProps {
  register: any;
  errors: any;
}

export default function SharesPricingSection({ register, errors }: SharesPricingSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Shares & Pricing</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FormInput
          id="totalShares"
          label="Total Shares *"
          type="number"
          placeholder="0"
          inputProps={register('totalShares')}
          error={errors.totalShares}
        />
        <FormInput
          id="availableShares"
          label="Available Shares *"
          type="number"
          placeholder="0"
          inputProps={register('availableShares')}
          error={errors.availableShares}
        />
        <FormInput
          id="pricePerShare"
          label="Price per Share *"
          type="number"
          placeholder="0"
          inputProps={register('pricePerShare')}
          error={errors.pricePerShare}
        />
        <FormInput
          id="appreciationRate"
          label="Appreciation Rate (%)"
          type="number"
          placeholder="0"
          inputProps={register('appreciationRate')}
          error={errors.appreciationRate}
        />
        <FormInput
          id="maxBookingDays"
          label="Max Booking Days"
          type="number"
          placeholder="0"
          inputProps={register('maxBookingDays')}
          error={errors.maxBookingDays}
        />
      </div>
    </div>
  );
}
