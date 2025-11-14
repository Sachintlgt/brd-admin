'use client';

import Link from 'next/link';
import { Edit, Trash2, Eye, Star, Power } from 'lucide-react';

interface PropertyActionsProps {
  propertyId: string;
  isActive: boolean;
  isFeatured: boolean;
  onToggleActive: () => void;
  onToggleFeatured: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function PropertyActions({
  propertyId,
  isActive,
  isFeatured,
  onToggleActive,
  onToggleFeatured,
  onDelete,
  isLoading = false,
}: PropertyActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* Toggle Active Button */}
      <button
        onClick={onToggleActive}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isActive ? 'Deactivate' : 'Activate'}
      >
        <Power className="h-5 w-5" />
      </button>

      {/* Toggle Featured Button */}
      <button
        onClick={onToggleFeatured}
        disabled={isLoading}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          isFeatured ? 'text-yellow-400 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-50'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        title={isFeatured ? 'Remove from featured' : 'Mark as featured'}
      >
        <Star className="h-5 w-5" />
      </button>

      {/* View Button */}
      <Link
        href={`/properties/${propertyId}`}
        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        title="View details"
      >
        <Eye className="h-5 w-5" />
      </Link>

      {/* Edit Button */}
      <Link
        href={`/properties/${propertyId}/edit`}
        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
        title="Edit property"
      >
        <Edit className="h-5 w-5" />
      </Link>

      {/* Delete Button */}
      <button
        onClick={onDelete}
        disabled={isLoading}
        className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        title="Delete property"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
