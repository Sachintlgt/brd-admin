'use client';

import { useEffect, useState, useCallback } from 'react';
import { PropertyFilterState } from '@/types/property-list';

/**
 * Custom hook to debounce filter changes
 * Prevents excessive API calls when filters are being updated frequently
 * (especially useful for search input and price range changes)
 */
export const useDebouncedFilters = (filters: PropertyFilterState, delay: number = 600) => {
  const [debouncedFilters, setDebouncedFilters] = useState<PropertyFilterState>(filters);

  useEffect(() => {
    // Set up a timer to update debounced filters after the delay
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, delay);

    // Clean up the timer if filters change before the delay is complete
    return () => clearTimeout(timer);
  }, [filters, delay]);

  return debouncedFilters;
};
