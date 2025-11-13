'use client';

import { Search, X } from 'lucide-react';
import { PropertyFilterState, SortField, SortOrder } from '@/types/property-list';

interface PropertyFiltersProps {
  filters: PropertyFilterState;
  onFiltersChange: (filters: Partial<PropertyFilterState>) => void;
  onReset: () => void;
  staffOptions?: Array<{ id: string; name: string }>;
}

export default function PropertyFilters({
  filters,
  onFiltersChange,
  onReset,
  staffOptions = [],
}: PropertyFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ searchTerm: value });
  };

  const handleStatusChange = (value: 'all' | 'active' | 'inactive') => {
    onFiltersChange({ statusFilter: value });
  };

  const handleFeaturedChange = (value: 'all' | 'featured' | 'not-featured') => {
    onFiltersChange({ featuredFilter: value });
  };

  const handleSortByChange = (value: SortField) => {
    onFiltersChange({ sortBy: value });
  };

  const handleSortOrderChange = (value: SortOrder) => {
    onFiltersChange({ sortOrder: value });
  };

  const handleLocationChange = (value: string) => {
    onFiltersChange({ location: value });
  };

  const handleMinPriceChange = (value: string) => {
    onFiltersChange({ minPrice: value ? parseFloat(value) : undefined });
  };

  const handleMaxPriceChange = (value: string) => {
    onFiltersChange({ maxPrice: value ? parseFloat(value) : undefined });
  };

  const handleStaffChange = (value: string) => {
    onFiltersChange({ staffId: value || undefined });
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.statusFilter !== 'all' ||
    filters.featuredFilter !== 'all' ||
    filters.location ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.staffId ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="space-y-4">
        {/* Search Bar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
        </div>

        {/* Filters Row 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as 'all' | 'active' | 'inactive')}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
            <select
              value={filters.featuredFilter}
              onChange={(e) =>
                handleFeaturedChange(e.target.value as 'all' | 'featured' | 'not-featured')
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Properties</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortByChange(e.target.value as SortField)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="name">Name</option>
              <option value="location">Location</option>
              <option value="pricePerShare">Price Per Share</option>
              <option value="totalShares">Total Shares</option>
              <option value="availableShares">Available Shares</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleSortOrderChange(e.target.value as SortOrder)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>

        {/* Filters Row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              placeholder="Filter by location..."
              value={filters.location || ''}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
            <input
              type="number"
              placeholder="Min price..."
              value={filters.minPrice || ''}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
            <input
              type="number"
              placeholder="Max price..."
              value={filters.maxPrice || ''}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
          </div>

          {/* Staff Filter */}
          {staffOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Staff</label>
              <select
                value={filters.staffId || ''}
                onChange={(e) => handleStaffChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">All Staff</option>
                {staffOptions.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="flex justify-end">
            <button
              onClick={onReset}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
