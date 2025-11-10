'use client';

import { useState } from 'react';
import { useProperties } from '../context/PropertiesContext';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import { Search, Edit, Trash2, Eye, Star, Power, Plus, Building2 } from 'lucide-react';

export default function Properties() {
  const { properties, deleteProperty, toggleActive, toggleFeatured } = useProperties();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured' | 'not-featured'>('all');

  const filteredProperties = properties.filter((property) => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && property.isActive) ||
                         (statusFilter === 'inactive' && !property.isActive);
    const matchesFeatured = featuredFilter === 'all' ||
                           (featuredFilter === 'featured' && property.isFeatured) ||
                           (featuredFilter === 'not-featured' && !property.isFeatured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="mt-2 text-gray-600">Manage your property portfolio</p>
          </div>
          <Link
            href="/properties/add"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or location..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as 'all' | 'featured' | 'not-featured')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            >
              <option value="all">All Properties</option>
              <option value="featured">Featured</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Properties ({filteredProperties.length})
          </h2>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || featuredFilter !== 'all'
                ? 'Try adjusting your filters.'
                : 'Get started by adding your first property.'}
            </p>
            <div className="mt-6">
              <Link
                href="/properties/add"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Property
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredProperties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-lg">
                        {property.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium text-gray-900">{property.name}</h3>
                        {property.isFeatured && (
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{property.location}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-sm text-gray-600">
                          ${property.oneTimePricing.toLocaleString()}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          property.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {property.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleActive(property.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        property.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={property.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => toggleFeatured(property.id)}
                      className={`p-2 rounded-lg transition-colors duration-200 ${
                        property.isFeatured
                          ? 'text-yellow-400 hover:bg-yellow-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={property.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                    >
                      <Star className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/properties/${property.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      title="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                    <Link
                      href={`/properties/${property.id}/edit`}
                      className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                      title="Edit property"
                    >
                      <Edit className="h-5 w-5" />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this property?')) {
                          deleteProperty(property.id);
                        }
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete property"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}