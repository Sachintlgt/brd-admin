'use client';

import { Building2, Loader } from 'lucide-react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PropertyListItem } from '@/types/property-list';
import PropertyListItemRow from './PropertyListItem';

interface PropertyListContentProps {
  properties: PropertyListItem[];
  isLoading: boolean;
  isError: boolean;
  error: any;
  hasFiltersApplied: boolean;
  onDelete: (id: string) => void;
  count: number;
}

export default function PropertyListContent({
  properties,
  isLoading,
  isError,
  error,
  hasFiltersApplied,
  onDelete,
  count,
}: PropertyListContentProps) {
  if (isLoading) {
    return (
      <div className="p-12 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="font-medium text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-red-500">
            <Building2 className="w-12 h-12 mx-auto" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Error Loading Properties</h3>
            <p className="mt-2 text-sm text-red-600">{error?.message || 'An error occurred'}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 mt-4 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
        <div className="py-12 text-center">
          <Building2 className="w-12 h-12 mx-auto text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasFiltersApplied
              ? 'Try adjusting your filters.'
              : 'Get started by adding your first property.'}
          </p>
          {!hasFiltersApplied && (
            <div className="mt-6">
              <Link
                href="/properties/add"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Property
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Properties ({count})</h2>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200">
        {properties.map((property) => (
          <PropertyListItemRow key={property.id} property={property} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}
