'use client';

import { useParams } from 'next/navigation';
import { useProperties } from '../../context/PropertiesContext';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';
import { Calendar, MapPin, DollarSign, FileText, Star, Edit, ArrowLeft, Image as ImageIcon, Video, File } from 'lucide-react';
import { useState } from 'react';

export default function PropertyDetail() {
  const { id } = useParams();
  const { properties, staff } = useProperties();
  const [activeTab, setActiveTab] = useState('overview');

  const property = properties.find(p => p.id === id);

  if (!property) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </DashboardLayout>
    );
  }

  const assignedStaff = staff.find(s => s.id === property.assignedStaff);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'media', name: 'Media', icon: ImageIcon },
    { id: 'documents', name: 'Documents', icon: File },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/properties"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  property.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {property.isActive ? 'Active' : 'Inactive'}
                </span>
                {property.isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/properties/${property.id}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Property
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{property.description || 'No description provided'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assigned Staff</dt>
                  <dd className="mt-1 text-sm text-gray-900">{assignedStaff?.name || 'Not assigned'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">One Time Pricing</dt>
                  <dd className="mt-1 text-sm text-gray-900">${property.oneTimePricing.toLocaleString()}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Maintenance Charges</dt>
                  <dd className="mt-1 text-sm text-gray-900">${property.maintenanceCharges.toLocaleString()}/month</dd>
                </div>
              </dl>
            </div>

            {property.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {property.purchasedSharesDetails && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchased Shares Details</h3>
                <p className="text-sm text-gray-700">{property.purchasedSharesDetails}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">One Time Price</p>
                    <p className="text-2xl font-bold text-gray-900">${property.oneTimePricing.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">${property.maintenanceCharges.toLocaleString()}/mo</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="h-8 w-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Appreciation</p>
                    <p className="text-2xl font-bold text-gray-900">${property.appreciationPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {property.phaseWisePricing.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phase-wise Pricing</h3>
                <div className="space-y-3">
                  {property.phaseWisePricing.map((phase, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{phase.phase}</span>
                      <span className="text-lg font-semibold text-gray-900">${phase.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'media' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2" />
                Photos ({property.photos.length})
              </h3>
              {property.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {property.photos.map((photo, index) => (
                    <div key={index} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-2">{photo}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No photos uploaded</p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Video className="h-5 w-5 mr-2" />
                Videos ({property.videos.length})
              </h3>
              {property.videos.length > 0 ? (
                <div className="space-y-3">
                  {property.videos.map((video, index) => (
                    <div key={index} className="flex items-center p-4 border border-gray-200 rounded-lg">
                      <Video className="h-6 w-6 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{video}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No videos uploaded</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <File className="h-5 w-5 mr-2" />
              Legal Documents ({property.legalDocuments.length})
            </h3>
            {property.legalDocuments.length > 0 ? (
              <div className="space-y-3">
                {property.legalDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <File className="h-6 w-6 text-gray-400 mr-3" />
                      <span className="text-sm text-gray-900">{doc}</span>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Booking Calendar
            </h3>
            <div className="bg-gray-50 rounded-lg p-6">
              <Calendar />
              <p className="mt-4 text-sm text-gray-600 text-center">
                Booking functionality will be implemented here
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}