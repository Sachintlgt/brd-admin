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
  error: Error | null;
  hasFiltersApplied: boolean;
  onToggleActive: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
  count: number;
}

export default function PropertyListContent({
  properties,
  isLoading,
  isError,
  error,
  hasFiltersApplied,
  onToggleActive,
  onToggleFeatured,
  onDelete,
  count,
}: PropertyListContentProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader className="h-12 w-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-red-500">
            <Building2 className="mx-auto h-12 w-12" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Error Loading Properties</h3>
            <p className="mt-2 text-sm text-red-600">{error?.message || 'An error occurred'}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
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
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Properties ({count})
        </h2>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-200">
        {properties.map((property) => (
          <PropertyListItemRow
            key={property.id}
            property={property}
            onToggleActive={onToggleActive}
            onToggleFeatured={onToggleFeatured}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
