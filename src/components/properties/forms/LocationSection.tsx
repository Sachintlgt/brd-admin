'use client';

import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { MapPin, Search, Edit3 } from 'lucide-react';
import FormInput from '../../ui/propertiesFormInput';
import FreeLocationPicker from '@/components/common/FreeLocationPicker';

// Keep your original type — 100% compatible
interface FreeLocationValue {
  name: string;
  formatted_address: string;
  place_id: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  viewport?: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
  zoom?: number;
}

interface LocationSectionProps {
  register: any;
  errors: any;
  control: any;
  setValue: any;
  getValues: any;
}

export default function LocationSection({
  register,
  errors,
  control,
  setValue,
  getValues,
}: LocationSectionProps) {
  const [useGoogleLocation, setUseGoogleLocation] = useState(false);

  // Function to extract address components from Nominatim response
  const extractAddressComponents = (item: any) => {
    const address = item.address || {};

    return {
      streetNumber: address.house_number || '',
      street: address.road || address.pedestrian || address.path || '',
      city: address.city || address.town || address.village || address.municipality || '',
      state: address.state || address.province || address.region || '',
      stateCode: address.state_code || address.province_code || '',
      country: address.country || '',
      countryCode: address.country_code || '',
      postalCode: address.postcode || '',
      postalCodeSuffix: '',
    };
  };

  // Handle Google location selection
  const handleGoogleLocationChange = (locationData: FreeLocationValue | null) => {
    if (locationData) {
      // Fetch detailed address information from Nominatim
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationData.location.coordinates[1]}&lon=${locationData.location.coordinates[0]}&addressdetails=1&accept-language=en`
      )
        .then((res) => res.json())
        .then((details) => {
          const addressComponents = extractAddressComponents(details);

          // Auto-fill all location fields
          setValue('location', locationData.formatted_address);
          setValue('locationLat', locationData.location.coordinates[1]); // lat
          setValue('locationLng', locationData.location.coordinates[0]); // lng
          setValue('locationPlaceId', parseFloat(locationData.place_id) || undefined);
          setValue('streetNumber', addressComponents.streetNumber);
          setValue('street', addressComponents.street);
          setValue('city', addressComponents.city);
          setValue('state', addressComponents.state);
          setValue('stateCode', addressComponents.stateCode);
          setValue('country', addressComponents.country);
          setValue('countryCode', addressComponents.countryCode);
          setValue('postalCode', addressComponents.postalCode);
          setValue('postalCodeSuffix', addressComponents.postalCodeSuffix);

          if (locationData.viewport) {
            setValue('viewportNortheastLat', locationData.viewport.northeast.lat);
            setValue('viewportNortheastLng', locationData.viewport.northeast.lng);
            setValue('viewportSouthwestLat', locationData.viewport.southwest.lat);
            setValue('viewportSouthwestLng', locationData.viewport.southwest.lng);
          }

          if (locationData.zoom) {
            setValue('zoom', locationData.zoom);
          }
        })
        .catch((err) => {
          console.error('Error fetching address details:', err);
          // Fallback: just fill basic fields
          setValue('location', locationData.formatted_address);
          setValue('locationLat', locationData.location.coordinates[1]);
          setValue('locationLng', locationData.location.coordinates[0]);
          setValue('locationPlaceId', parseFloat(locationData.place_id) || undefined);
        });
    } else {
      // Clear all location fields when location is cleared
      setValue('location', '');
      setValue('locationLat', undefined);
      setValue('locationLng', undefined);
      setValue('locationPlaceId', '');
      setValue('streetNumber', '');
      setValue('street', '');
      setValue('city', '');
      setValue('state', '');
      setValue('stateCode', '');
      setValue('country', '');
      setValue('countryCode', '');
      setValue('postalCode', '');
      setValue('postalCodeSuffix', '');
      setValue('viewportNortheastLat', undefined);
      setValue('viewportNortheastLng', undefined);
      setValue('viewportSouthwestLat', undefined);
      setValue('viewportSouthwestLng', undefined);
      setValue('zoom', undefined);
    }
  };

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Location Information</h2>

      {/* Location Method Toggle */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setUseGoogleLocation(true)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              useGoogleLocation
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Search className="w-4 h-4 mr-2" />
            Search Location
          </button>
          <button
            type="button"
            onClick={() => setUseGoogleLocation(false)}
            className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
              !useGoogleLocation
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Manual Entry
          </button>
        </div>
      </div>

      {/* Google Location Picker */}
      {useGoogleLocation && (
        <div className="mb-6">
          <Controller
            name="googleLocation"
            control={control}
            render={({ field }) => (
              <FreeLocationPicker
                id="googleLocation"
                label="Search Property Location"
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  handleGoogleLocationChange(value);
                }}
                error={errors.googleLocation}
                placeholder="Search for property location..."
              />
            )}
          />
        </div>
      )}

      {/* Location Fields */}
      <div className="space-y-6">
        {/* Primary Location Field */}
        <FormInput
          id="location"
          label="Complete Address *"
          placeholder="Enter complete property address"
          inputProps={register('location')}
          error={errors.location}
        />

        {/* Location Coordinates */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            id="locationLat"
            label="Latitude"
            type="number"
            placeholder="e.g., 40.7128"
            inputProps={{ ...register('locationLat'), step: 'any' }}
            error={errors.locationLat}
          />
          <FormInput
            id="locationLng"
            label="Longitude"
            type="number"
            placeholder="e.g., -74.0060"
            inputProps={{ ...register('locationLng'), step: 'any' }}
            error={errors.locationLng}
          />
        </div>

        {/* Address Components */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            id="streetNumber"
            label="Street Number"
            placeholder="e.g., 123"
            inputProps={register('streetNumber')}
            error={errors.streetNumber}
          />
          <FormInput
            id="street"
            label="Street Name"
            placeholder="e.g., Main Street"
            inputProps={register('street')}
            error={errors.street}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormInput
            id="city"
            label="City *"
            placeholder="e.g., New York"
            inputProps={register('city')}
            error={errors.city}
          />
          <FormInput
            id="state"
            label="State *"
            placeholder="e.g., New York"
            inputProps={register('state')}
            error={errors.state}
          />
          <FormInput
            id="stateCode"
            label="State Code"
            placeholder="e.g., NY"
            inputProps={register('stateCode')}
            error={errors.stateCode}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FormInput
            id="country"
            label="Country *"
            placeholder="e.g., United States"
            inputProps={register('country')}
            error={errors.country}
          />
          <FormInput
            id="countryCode"
            label="Country Code"
            placeholder="e.g., US"
            inputProps={register('countryCode')}
            error={errors.countryCode}
          />
          <FormInput
            id="postalCode"
            label="Postal Code *"
            placeholder="e.g., 10001"
            inputProps={register('postalCode')}
            error={errors.postalCode}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            id="postalCodeSuffix"
            label="Postal Code Suffix"
            placeholder="e.g., 1234"
            inputProps={register('postalCodeSuffix')}
            error={errors.postalCodeSuffix}
          />
          <FormInput
            id="locationPlaceId"
            label="Place ID"
            placeholder="Location identifier"
            inputProps={register('locationPlaceId')}
            error={errors.locationPlaceId}
          />
        </div>

        {/* Viewport Fields */}
        <div className="border-t pt-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Map Viewport (Optional)</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormInput
            id="viewportNortheastLat"
            label="Northeast Latitude"
            type="number"
            placeholder="e.g., 40.7831"
            inputProps={{ ...register('viewportNortheastLat'), step: 'any' }}
            error={errors.viewportNortheastLat}
          />
          <FormInput
            id="viewportNortheastLng"
            label="Northeast Longitude"
            type="number"
            placeholder="e.g., -73.9712"
            inputProps={{ ...register('viewportNortheastLng'), step: 'any' }}
            error={errors.viewportNortheastLng}
          />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
            <FormInput
              id="viewportSouthwestLat"
              label="Southwest Latitude"
              type="number"
              placeholder="e.g., 40.6961"
              inputProps={{ ...register('viewportSouthwestLat'), step: 'any' }}
              error={errors.viewportSouthwestLat}
            />
            <FormInput
              id="viewportSouthwestLng"
              label="Southwest Longitude"
              type="number"
              placeholder="e.g., -74.0225"
              inputProps={{ ...register('viewportSouthwestLng'), step: 'any' }}
              error={errors.viewportSouthwestLng}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-4">
            <FormInput
              id="zoom"
              label="Map Zoom Level"
              type="number"
              placeholder="e.g., 12"
              inputProps={register('zoom')}
              error={errors.zoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
