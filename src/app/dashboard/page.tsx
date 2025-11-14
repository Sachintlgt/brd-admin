'use client';

import { useProperties } from '../context/PropertiesContext';
import Link from 'next/link';
import DashboardLayout from '../../components/DashboardLayout';
import { Building2, CheckCircle, Star, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { properties } = useProperties();

  const stats = [
    {
      name: 'Total Properties',
      value: properties.length,
      icon: Building2,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Active Properties',
      value: properties.filter((p) => p.isActive).length,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Featured Properties',
      value: properties.filter((p) => p.isFeatured).length,
      icon: Star,
      color: 'bg-yellow-500',
      change: '+23%',
      changeType: 'increase',
    },
    {
      name: 'Total Value',
      value: `$${(properties.reduce((sum, p) => sum + p.oneTimePricing, 0) / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'increase',
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here&apos;s an overview of your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/properties/add"
            className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Add New Property
          </Link>
          <Link
            href="/properties"
            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            View All Properties
          </Link>
          <Link
            href="/staff"
            className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            Manage Staff
          </Link>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Properties</h2>
          <Link
            href="/properties"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-4">
          {properties.slice(0, 5).map((property) => (
            <div
              key={property.id}
              className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{property.name}</h3>
                  <p className="text-sm text-gray-500">{property.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {property.isActive ? 'Active' : 'Inactive'}
                </span>
                <Link
                  href={`/properties/${property.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
          {properties.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No properties yet</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding your first property.
              </p>
              <div className="mt-6">
                <Link
                  href="/properties/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Building2 className="h-5 w-5 mr-2" />
                  Add Property
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
