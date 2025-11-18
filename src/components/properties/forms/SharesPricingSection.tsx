import FormInput from '../../ui/propertiesFormInput';
import CurrencyInput from '../../ui/currencyInput';

interface SharesPricingSectionProps {
  register: any;
  errors: any;
}

export default function SharesPricingSection({ register, errors }: SharesPricingSectionProps) {
  return (
    <div className="space-y-8">
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
          <CurrencyInput
            id="initialPricePerShare"
            label="Initial Price per Share *"
            placeholder="₹ 0"
            inputProps={register('initialPricePerShare')}
            error={errors.initialPricePerShare}
          />
          <CurrencyInput
            id="currentPricePerShare"
            label="Current Price per Share"
            placeholder="₹ 0"
            inputProps={register('currentPricePerShare')}
            error={errors.currentPricePerShare}
          />
          <CurrencyInput
            id="wholeUnitPrice"
            label="Whole Unit Price"
            placeholder="₹ 0"
            inputProps={register('wholeUnitPrice')}
            error={errors.wholeUnitPrice}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput
            id="targetIRR"
            label="Target IRR (%)"
            type="number"
            placeholder="0"
            inputProps={register('targetIRR')}
            error={errors.targetIRR}
          />
          <FormInput
            id="targetRentalYield"
            label="Target Rental Yield"
            placeholder="e.g., 6-8%"
            inputProps={register('targetRentalYield')}
            error={errors.targetRentalYield}
          />
          <FormInput
            id="appreciationRate"
            label="Appreciation Rate (%)"
            type="number"
            placeholder="0"
            inputProps={register('appreciationRate')}
            error={errors.appreciationRate}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Dates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Possession Date</label>
            <input
              type="datetime-local"
              {...register('possessionDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.possessionDate && (
              <p className="mt-1 text-sm text-red-600">{String(errors.possessionDate.message)}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Launch Date</label>
            <input
              type="datetime-local"
              {...register('launchDate')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.launchDate && (
              <p className="mt-1 text-sm text-red-600">{String(errors.launchDate.message)}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Configuration</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput
            id="maxBookingDays"
            label="Max Booking Days"
            type="number"
            placeholder="0"
            inputProps={register('maxBookingDays')}
            error={errors.maxBookingDays}
          />
          <CurrencyInput
            id="bookingAmount"
            label="Booking Amount"
            placeholder="₹ 0"
            inputProps={register('bookingAmount')}
            error={errors.bookingAmount}
          />
          <CurrencyInput
            id="bookingAmountGST"
            label="Booking Amount GST"
            placeholder="₹ 0"
            inputProps={register('bookingAmountGST')}
            error={errors.bookingAmountGST}
          />
        </div>
      </div>
    </div>
  );
}
