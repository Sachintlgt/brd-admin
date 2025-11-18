'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import PropertyFilters from '../../components/properties/list/PropertyFilters';
import PropertyListContent from '../../components/properties/list/PropertyListContent';
import PropertyPagination from '../../components/properties/list/PropertyPagination';
import {
  usePropertiesList,
  useDeleteProperty,
  useToggleActive,
  useToggleFeatured,
} from '../../hooks/usePropertiesList';
import { useDebouncedFilters } from '../../hooks/useDebouncedFilters';
import { PropertyFilterState } from '../../types/property-list';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import toast from 'react-hot-toast';

const DEFAULT_FILTERS: PropertyFilterState = {
  searchTerm: '',
  statusFilter: 'all',
  featuredFilter: 'all',
  page: 1,
  limit: 10,
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export default function Properties() {
  const [filters, setFilters] = useState<PropertyFilterState>(DEFAULT_FILTERS);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<any>(null);
  // Debounce filters to prevent excessive API calls (especially for search)
  // Uses 600ms delay which is appropriate for user input
  const debouncedFilters = useDebouncedFilters(filters, 600);

  // TanStack Query hooks for data fetching
  // Uses debounced filters to avoid multiple API calls
  const { data, isLoading, isError, error } = usePropertiesList({
    page: debouncedFilters.page,
    limit: debouncedFilters.limit,
    search: debouncedFilters.searchTerm || undefined,
    isActive:
      debouncedFilters.statusFilter === 'all'
        ? undefined
        : debouncedFilters.statusFilter === 'active',
    isFeatured:
      debouncedFilters.featuredFilter === 'all'
        ? undefined
        : debouncedFilters.featuredFilter === 'featured',
    sortBy: debouncedFilters.sortBy,
    sortOrder: debouncedFilters.sortOrder,
    location: debouncedFilters.location || undefined,
    minPrice: debouncedFilters.minPrice,
    maxPrice: debouncedFilters.maxPrice,
    staffId: debouncedFilters.staffId,
  });

  // Mutations for property actions
  const deletePropertyMutation = useDeleteProperty();
  const toggleActiveMutation = useToggleActive();
  const toggleFeaturedMutation = useToggleFeatured();

  // Extract pagination data
  const pagination = useMemo(() => {
    if (!data?.data?.pagination) {
      return {
        page: debouncedFilters.page || 1,
        limit: debouncedFilters.limit || 10,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }
    return data.data.pagination;
  }, [data, debouncedFilters.page, debouncedFilters.limit]);

  // Extract properties list
  const properties = useMemo(() => {
    const props = data?.data?.properties;
    if (!Array.isArray(props)) {
      console.warn('Properties data is not an array:', props); // Debug log
      return [];
    }
    return props;
  }, [data]);

  // Check if any filters are applied
  const hasFiltersApplied = useMemo(() => {
    return (
      filters.searchTerm !== '' ||
      filters.statusFilter !== 'all' ||
      filters.featuredFilter !== 'all' ||
      filters.location !== undefined ||
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.staffId !== undefined ||
      filters.sortBy !== 'createdAt' ||
      filters.sortOrder !== 'desc'
    );
  }, [filters]);

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<PropertyFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle delete
  const handleDelete = (id: string) => {
    const property = properties.find((p: any) => p.id === id);
    if (property) {
      setPropertyToDelete(property);
      setDeleteDialogOpen(true);
    }
  };

  // Handle toggle active
  const handleToggleActive = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      toggleActiveMutation.mutate({
        id,
        isActive: !property.isActive,
      });
    }
  };

  // Handle toggle featured
  const handleToggleFeatured = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      toggleFeaturedMutation.mutate({
        id,
        isFeatured: !property.isFeatured,
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="mt-2 text-gray-600">Manage your property portfolio</p>
          </div>
          <Link
            href="/properties/add"
            className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <PropertyFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
        staffOptions={[]}
      />

      {/* Properties List Content */}
      <PropertyListContent
        properties={properties}
        isLoading={isLoading}
        isError={isError}
        error={error}
        hasFiltersApplied={hasFiltersApplied}
        onToggleActive={handleToggleActive}
        onToggleFeatured={handleToggleFeatured}
        onDelete={handleDelete}
        count={pagination.total}
      />

      {/* Pagination */}
      {!isLoading && properties.length > 0 && (
        <PropertyPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setPropertyToDelete(null); // clear when closed via cancel/backdrop/esc
          }
        }}
        onConfirm={() => {
          if (!propertyToDelete) return;

          deletePropertyMutation.mutate(propertyToDelete.id, {
            onSuccess: () => {
              toast.success('Property deleted successfully');
              setDeleteDialogOpen(false);
              setPropertyToDelete(null);
            },
            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || error?.message || 'Failed to delete property',
              );
              // Modal stays open so user can retry
            },
          });
        }}
        title="Delete Property"
        description={
          propertyToDelete
            ? `Are you sure you want to delete the property "${
                propertyToDelete.title ||
                propertyToDelete.address ||
                propertyToDelete.name ||
                propertyToDelete.id
              }"? This action cannot be undone.`
            : 'Are you sure you want to delete this property? This action cannot be undone.'
        }
        isLoading={deletePropertyMutation.isPending}
      />
    </DashboardLayout>
  );
}
