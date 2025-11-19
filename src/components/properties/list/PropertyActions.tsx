'use client';

import Link from 'next/link';
import { Edit, Trash2, Eye, Star, Power } from 'lucide-react';

interface PropertyActionsProps {
  propertyId: string;
  isActive: boolean;
  isFeatured: boolean;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function PropertyActions({
  propertyId,
  isActive,
  isFeatured,
  onDelete,
  isLoading = false,
}: PropertyActionsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* View Button */}
      <Link
        href={`/properties/${propertyId}`}
        className="p-2 text-blue-600 transition-colors duration-200 rounded-lg hover:bg-blue-50"
        title="View details"
      >
        <Eye className="w-5 h-5" />
      </Link>

      {/* Edit Button */}
      <Link
        href={`/properties/${propertyId}/edit`}
        className="p-2 text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50"
        title="Edit property"
      >
        <Edit className="w-5 h-5" />
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
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}
