/**
 * Property List API Types and Interfaces
 */

// API Query Parameters
export interface PropertyListFilters {
  page?: number;
  limit?: number;
  search?: string;
  name?: string;
  location?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortBy?: SortField;
  sortOrder?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
  staffId?: string;
}

// Sort Options
export type SortField =
  | 'createdAt'
  | 'updatedAt'
  | 'name'
  | 'location'
  | 'pricePerShare'
  | 'totalShares'
  | 'availableShares';
export type SortOrder = 'asc' | 'desc';

// Property List Item (returned from API)
export interface PropertyListItem {
  id: string;
  name: string;
  location: string;
  description?: string;
  pricePerShare: number;
  totalShares: number;
  availableShares: number;
  isActive: boolean;
  isFeatured: boolean;
  assignedStaffId?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  amenities?: string[];
}

// API Response Structure
export interface PropertyListResponse {
  success: boolean;
  data: {
    properties: PropertyListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Filter State UI (client side)
export interface PropertyFilterState {
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
  featuredFilter: 'all' | 'featured' | 'not-featured';
  page: number;
  limit: number;
  sortBy: SortField;
  sortOrder: SortOrder;
  minPrice?: number;
  maxPrice?: number;
  staffId?: string;
  location?: string;
}

// Action state for mutations
export interface PropertyActionState {
  isLoading: boolean;
  error: string | null;
}
