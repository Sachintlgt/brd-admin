// src/app/properties/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import PropertyFilters from '../../components/properties/list/PropertyFilters';
import PropertyListContent from '../../components/properties/list/PropertyListContent';
import PropertyPagination from '../../components/properties/list/PropertyPagination';
import { DeleteConfirmationDialog } from '@/components/common/DeleteConfirmationDialog';
import { useDebouncedFilters } from '../../hooks/useDebouncedFilters';
import { PropertyFilterState } from '../../types/property-list';

// Import new hooks
import { usePropertiesQuery } from '@/hooks/queries';
import { useDeleteProperty, useToggleActive, useToggleFeatured } from '@/hooks/mutations';

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

  // Debounce filters
  const debouncedFilters = useDebouncedFilters(filters, 600);

  // Queries
  const { data, isLoading, isError, error } = usePropertiesQuery({
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

  // Mutations
  const deletePropertyMutation = useDeleteProperty();
  const toggleActiveMutation = useToggleActive();
  const toggleFeaturedMutation = useToggleFeatured();

  // Extract data
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

  const properties = useMemo(() => {
    const props = data?.data?.properties;
    if (!Array.isArray(props)) return [];
    return props;
  }, [data]);

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

  // Handlers
  const handleFiltersChange = (newFilters: Partial<PropertyFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    const property = properties.find((p: any) => p.id === id);
    if (property) {
      setPropertyToDelete(property);
      setDeleteDialogOpen(true);
    }
  };

  const handleToggleActive = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      toggleActiveMutation.mutate({
        id,
        isActive: !property.isActive,
      });
    }
  };

  const handleToggleFeatured = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      toggleFeaturedMutation.mutate({
        id,
        isFeatured: !property.isFeatured,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!propertyToDelete) return;

    deletePropertyMutation.mutate(propertyToDelete.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setPropertyToDelete(null);
      },
      // Error is already handled in the mutation hook
    });
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

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) {
            setPropertyToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Property"
        description={
          propertyToDelete
            ? `Are you sure you want to delete "${propertyToDelete.name || propertyToDelete.id}"? This action cannot be undone.`
            : 'Are you sure you want to delete this property?'
        }
        isLoading={deletePropertyMutation.isPending}
      />
    </DashboardLayout>
  );
}
