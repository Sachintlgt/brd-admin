'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertyPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function PropertyPagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  total,
  limit,
  onPageChange,
}: PropertyPaginationProps) {
  const startRecord = (currentPage - 1) * limit + 1;
  const endRecord = Math.min(currentPage * limit, total);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mt-6">
      <div className="flex items-center justify-between">
        {/* Records Info */}
        <div className="text-sm text-gray-600">
          Showing <span className="font-medium">{startRecord}</span> to{' '}
          <span className="font-medium">{endRecord}</span> of{' '}
          <span className="font-medium">{total}</span> properties
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              hasPrevPage
                ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {/* First Page */}
            {currentPage > 2 && (
              <>
                <button
                  onClick={() => onPageChange(1)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  1
                </button>
                {currentPage > 3 && <span className="text-gray-400">...</span>}
              </>
            )}

            {/* Previous Page */}
            {hasPrevPage && (
              <button
                onClick={() => onPageChange(currentPage - 1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                {currentPage - 1}
              </button>
            )}

            {/* Current Page */}
            <button className="px-3 py-2 rounded-lg text-sm font-medium text-white bg-blue-600">
              {currentPage}
            </button>

            {/* Next Page */}
            {hasNextPage && (
              <button
                onClick={() => onPageChange(currentPage + 1)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                {currentPage + 1}
              </button>
            )}

            {/* Last Page */}
            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="text-gray-400">...</span>}
                <button
                  onClick={() => onPageChange(totalPages)}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              hasNextPage
                ? 'text-gray-600 hover:bg-gray-100 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
            }`}
            title="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Page Info */}
        <div className="text-sm text-gray-600">
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </div>
      </div>
    </div>
  );
}
