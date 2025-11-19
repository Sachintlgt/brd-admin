'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Loader2 } from 'lucide-react';
import { FieldError } from 'react-hook-form';

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

interface Props {
  id?: string;
  label?: string;
  value?: FreeLocationValue | null;
  onChange: (value: FreeLocationValue | null) => void;
  error?: FieldError;
  placeholder?: string;
}

export default function FreeLocationPicker({
  id,
  label,
  value,
  onChange,
  error,
  placeholder = 'Search for a location...',
}: Props) {
  const [query, setQuery] = useState<string>(value?.formatted_address || '');
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search using Nominatim
  const searchLocation = async (input: string) => {
    if (!input.trim()) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          input,
        )}&limit=6&addressdetails=1&accept-language=en`,
      );
      const data = await res.json();

      setPredictions(data);
      setIsOpen(true);
    } catch (err) {
      console.error('Nominatim error:', err);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounce input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      searchLocation(value);
    }, 400); // Smooth 400ms debounce
  };

  // Select a place
  const handleSelect = (item: any) => {
    const locationData: FreeLocationValue = {
      name: item.display_name.split(',')[0].trim(),
      formatted_address: item.display_name,
      place_id: item.place_id || item.osm_id || item.lat + item.lon,
      location: {
        type: 'Point',
        coordinates: [parseFloat(item.lon), parseFloat(item.lat)],
      },
      zoom: item.type === 'city' || item.type === 'country' ? 10 : 16,
    };

    onChange(locationData);
    setQuery(item.display_name);
    setIsOpen(false);
    setPredictions([]);
  };

  // Clear selection
  const handleClear = () => {
    onChange(null);
    setQuery('');
    setPredictions([]);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div ref={wrapperRef} className="relative">
        {/* Input */}
        <div className="relative">
          <MapPin className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 pointer-events-none left-3 top-1/2" />
          <input
            id={id}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={placeholder}
            className="w-full py-3 pl-10 pr-10 text-gray-900 placeholder-gray-500 transition-all bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
          {/* Clear button */}
          {(query || value) && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {/* Loading spinner */}
          {loading && (
            <div className="absolute -translate-y-1/2 right-3 top-1/2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border border-gray-200 shadow-lg rounded-xl max-h-80">
            {predictions.length === 0 && !loading && query.length > 2 && (
              <div className="px-4 py-8 text-sm text-center text-gray-500">No results found</div>
            )}

            {predictions.map((item) => (
              <button
                key={item.place_id || item.osm_id}
                onMouseDown={(e) => e.preventDefault()} // Prevent input blur
                onClick={() => handleSelect(item)}
                className="flex items-start w-full gap-3 px-4 py-3 text-left transition-colors border-b border-gray-100 hover:bg-gray-50 last:border-0"
              >
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.display_name.split(',')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{item.display_name}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Selected Location Preview */}
      {value?.location?.coordinates && (
        <div className="p-4 text-sm border border-blue-200 bg-blue-50 rounded-xl">
          <p className="font-medium text-blue-900">{value.name}</p>
          <p className="mt-1 text-blue-700">{value.formatted_address}</p>
          <p className="mt-2 font-mono text-xs text-blue-600">
            {value.location.coordinates[1].toFixed(6)}, {value.location.coordinates[0].toFixed(6)}
          </p>
        </div>
      )}

      {/* Error */}
      {error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
}
