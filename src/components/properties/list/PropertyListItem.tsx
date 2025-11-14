'use client';

import { Star } from 'lucide-react';
import { PropertyListItem } from '@/types/property-list';
import PropertyActions from './PropertyActions';

interface PropertyListItemProps {
  property: PropertyListItem;
  onToggleActive: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function PropertyListItemRow({
  property,
  onToggleActive,
  onToggleFeatured,
  onDelete,
  isLoading = false,
}: PropertyListItemProps) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center justify-between">
        {/* Left Section: Property Info */}
        <div className="flex items-center space-x-4 flex-1">
          {/* Avatar */}
          <div className="w-12 h-12 bg-linear-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-medium text-lg">
              {property.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex-1 min-w-0">
            {/* Name and Featured Star */}
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-medium text-gray-900 truncate">{property.name}</h3>
              {property.isFeatured && (
                <Star className="h-5 w-5 text-yellow-400 fill-current shrink-0" />
              )}
            </div>

            {/* Location */}
            <p className="text-sm text-gray-500 truncate">{property.location}</p>

            {/* Stats Row */}
            <div className="flex items-center space-x-4 mt-2 flex-wrap">
              {/* Price */}
              <span className="text-sm font-medium text-gray-600">
                ${property.pricePerShare?.toLocaleString() || 'N/A'} per share
              </span>

              {/* Shares Info */}
              {property.totalShares && (
                <span className="text-sm text-gray-500">
                  {property.availableShares}/{property.totalShares} available
                </span>
              )}

              {/* Status Badge */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                  property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {property.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <PropertyActions
          propertyId={property.id}
          isActive={property.isActive}
          isFeatured={property.isFeatured}
          onToggleActive={() => onToggleActive(property.id)}
          onToggleFeatured={() => onToggleFeatured(property.id)}
          onDelete={() => onDelete(property.id)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
