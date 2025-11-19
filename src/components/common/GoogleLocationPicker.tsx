'use client';

import React from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { MapPin, X } from 'lucide-react';
import { FieldError } from 'react-hook-form';

interface GoogleLocationValue {
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

interface Props {
  id?: string;
  label?: string;
  value?: GoogleLocationValue | null;
  onChange: (value: GoogleLocationValue | null) => void;
  error?: FieldError;
  placeholder?: string;
}

export default function GoogleLocationPicker({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = 'Search for a location...',
}: Props) {
  const {
    ready,
    value: searchValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
    defaultValue: value?.formatted_address || '',
  });

  const handleSelect = async (description: string, placeId: string) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      const selectedPlace = results[0];

      const locationData: GoogleLocationValue = {
        name: selectedPlace.formatted_address.split(',')[0],
        formatted_address: selectedPlace.formatted_address,
        place_id: selectedPlace.place_id,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        viewport: selectedPlace.geometry?.viewport
          ? {
              northeast: {
                lat: selectedPlace.geometry.viewport.getNorthEast().lat(),
                lng: selectedPlace.geometry.viewport.getNorthEast().lng(),
              },
              southwest: {
                lat: selectedPlace.geometry.viewport.getSouthWest().lat(),
                lng: selectedPlace.geometry.viewport.getSouthWest().lng(),
              },
            }
          : undefined,
        zoom: 15,
      };

      onChange(locationData);
    } catch (err) {
      console.error('Geocode error:', err);
    }
  };

  const handleClear = () => {
    onChange(null);
    setValue('');
    clearSuggestions();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <Command className="border rounded-xl">
          <div className="flex items-center px-3 border-b">
            <MapPin className="w-5 h-5 mr-2 text-gray-400" />
            <CommandInput
              placeholder={placeholder}
              value={searchValue}
              onValueChange={setValue}
              disabled={!ready}
              className="h-12 border-0 focus:ring-0"
            />
            {(searchValue || value) && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 ml-auto rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <CommandList>
            {status === 'OK' && (
              <CommandGroup>
                {data.map(({ place_id, description }) => (
                  <CommandItem
                    key={place_id}
                    value={description}
                    onSelect={() => handleSelect(description, place_id)}
                    className="cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                    {description}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {status === 'OK' && data.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}
          </CommandList>
        </Command>
      </div>

      {value && (
        <div className="p-4 text-sm border border-blue-200 bg-blue-50 rounded-xl">
          <p className="font-medium text-blue-900">{value.name}</p>
          <p className="mt-1 text-blue-700">{value.formatted_address}</p>
          <p className="mt-2 font-mono text-xs text-blue-600">
            {value.location.coordinates[1].toFixed(6)}, {value.location.coordinates[0].toFixed(6)}
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
