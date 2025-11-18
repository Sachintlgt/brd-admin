'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  DollarSign,
  FileText,
  Star,
  Edit,
  ArrowLeft,
  Image as ImageIcon,
  Video,
  File,
  Users,
  TrendingUp,
  Clock,
  History,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useProperties } from '@/app/context/PropertiesContext';
import DashboardLayout from '@/components/DashboardLayout';
import { propertiesApi } from '@/api/endpoints/properties.api';

// Helper to build full URLs
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function PropertyDetail() {
  const { id } = useParams();
  const { staff } = useProperties();
  const [activeTab, setActiveTab] = useState('overview');
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await propertiesApi.getPropertyById(id as string);
        if (response.success && response.data) {
          setProperty(response.data);
        } else {
          throw new Error(response.message || 'Failed to load property');
        }
      } catch (err: any) {
        const msg = err?.message || 'Failed to load property';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !property) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <p className="text-red-600">{error || 'Property not found'}</p>
          <Link
            href="/properties"
            className="inline-flex items-center mt-4 text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Properties
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Transform API data to UI-friendly shape
  const uiProperty = {
    id: property.id,
    name: property.name,
    location: property.location,
    description: property.description || 'No description provided',
    isActive: property.isActive,
    isFeatured: property.isFeatured,
    totalShares: property.totalShares,
    availableShares: property.availableShares,
    soldShares: property.soldShares,
    occupancyRate: property.occupancyRate,
    pricePerShare: property.pricePerShare,
    appreciationRate: property.appreciationRate,
    maxBookingDays: property.maxBookingDays,
    oneTimePricing: property.pricings?.find((p: any) => p.type === 'ONE_TIME')?.price || 0,
    maintenanceCharges: property.maintenanceTemplates?.find((t: any) => t.isActive)?.amount || 0,
    appreciationPrice: property.appreciationRate,
    phaseWisePricing: property.pricings?.filter((p: any) => p.phaseName) || [],
    photos:
      property.images?.filter((i: any) => i.type === 'image').map((i: any) => BASE_URL + i.url) ||
      [],
    videos:
      property.images?.filter((i: any) => i.type === 'video').map((i: any) => BASE_URL + i.url) ||
      [],
    legalDocuments: property.documents || [],
    amenities: property.amenities?.map((a: any) => a.name) || [],
    purchasedSharesDetails:
      property.shareDetails
        ?.map((s: any) => `${s.title}: ${s.shareCount} shares @ $${s.amount}`)
        .join(', ') || null,
    maintenanceTemplates: property.maintenanceTemplates || [],
    priceHistory: property.priceHistory || [],
    maintenanceHistory: property.maintenanceHistory || [],
  };

  const assignedStaff = staff.find((s: any) => s.id === property.assignedStaff);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'media', name: 'Media', icon: ImageIcon },
    { id: 'documents', name: 'Documents', icon: File },
    { id: 'maintenance', name: 'Maintenance', icon: Clock },
    { id: 'history', name: 'History', icon: History },
    { id: 'calendar', name: 'Calendar', icon: Calendar },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/properties"
              className="inline-flex items-center px-3 py-2 text-gray-700 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{uiProperty.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  {uiProperty.location}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    uiProperty.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {uiProperty.isActive ? 'Active' : 'Inactive'}
                </span>
                {uiProperty.isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
          <Link
            href={`/properties/${uiProperty.id}/edit`}
            className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Property
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex flex-wrap gap-2 -mb-px sm:gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Property Information</h3>
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.location}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.description}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Assigned Staff</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {assignedStaff?.name || 'Not assigned'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Total Shares</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.totalShares}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Available Shares</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.availableShares}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Sold Shares</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.soldShares}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Occupancy Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.occupancyRate}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Booking Days</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.maxBookingDays || 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Amenities */}
            {uiProperty.amenities.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {uiProperty.amenities.map((amenity: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Purchased Shares */}
            {uiProperty.purchasedSharesDetails && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Purchased Shares Details
                </h3>
                <p className="text-sm text-gray-700">{uiProperty.purchasedSharesDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* Pricing */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="p-5 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">One-Time Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${uiProperty.oneTimePricing.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-blue-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Maintenance</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${uiProperty.maintenanceCharges.toLocaleString()}/mo
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-5 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex items-center">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-600">Appreciation Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {uiProperty.appreciationRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {uiProperty.phaseWisePricing.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Phase-wise Pricing</h3>
                <div className="space-y-3">
                  {uiProperty.phaseWisePricing.map((phase: any, i: number) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">
                        {phase.phaseName || phase.label}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        ${phase.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Media */}
        {activeTab === 'media' && (
          <div className="space-y-8">
            <div>
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <ImageIcon className="w-5 h-5 mr-2" />
                Photos ({uiProperty.photos.length})
              </h3>
              {uiProperty.photos.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {uiProperty.photos.map((urlImage: string, i: number) => (
                    <a
                      key={i}
                      href={urlImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden transition-shadow border border-gray-200 rounded-lg aspect-square hover:shadow-md"
                    >
                      <img
                        src={urlImage}
                        alt={`Photo ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No photos uploaded</p>
              )}
            </div>

            <div>
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Video className="w-5 h-5 mr-2" />
                Videos ({uiProperty.videos.length})
              </h3>
              {uiProperty.videos.length > 0 ? (
                <div className="space-y-3">
                  {uiProperty.videos.map((video: string, i: number) => (
                    <a
                      key={i}
                      href={video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <Video className="w-6 h-6 mr-3 text-gray-400" />
                      <span className="text-sm text-gray-900 truncate">
                        {video.split('/').pop()}
                      </span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No videos uploaded</p>
              )}
            </div>
          </div>
        )}

        {/* Documents */}
        {activeTab === 'documents' && (
          <div>
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <File className="w-5 h-5 mr-2" />
              Legal Documents ({uiProperty.legalDocuments.length})
            </h3>
            {uiProperty.legalDocuments.length > 0 ? (
              <div className="space-y-3">
                {uiProperty.legalDocuments.map((doc: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <File className="w-6 h-6 mr-3 text-gray-400" />
                      <span className="text-sm text-gray-900">{doc.name}</span>
                    </div>
                    <a
                      href={BASE_URL + doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No documents uploaded</p>
            )}
          </div>
        )}

        {/* Maintenance */}
        {activeTab === 'maintenance' && (
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Maintenance Templates</h3>
            {uiProperty.maintenanceTemplates.length > 0 ? (
              <div className="space-y-4">
                {uiProperty.maintenanceTemplates.map((tmpl: any) => (
                  <div key={tmpl.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{tmpl.description}</p>
                        <p className="mt-1 text-sm text-gray-600">
                          {tmpl.chargeType} • ${tmpl.amount.toLocaleString()} • Due Day:{' '}
                          {tmpl.dueDay}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {format(new Date(tmpl.startDate), 'PP')} –{' '}
                          {tmpl.endDate ? format(new Date(tmpl.endDate), 'PP') : 'Ongoing'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          tmpl.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {tmpl.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No maintenance templates</p>
            )}
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Price History</h3>
              {uiProperty.priceHistory.length > 0 ? (
                <div className="space-y-3">
                  {uiProperty.priceHistory.map((h: any) => (
                    <div key={h.id} className="p-4 text-sm border border-gray-200 rounded-lg">
                      <p className="font-medium text-gray-900">{h.changeReason}</p>
                      <p className="text-gray-600">
                        {h.previousPrice !== null && `Price: $${h.previousPrice} → $${h.newPrice}`}
                        {h.previousAppreciation !== null &&
                          ` | Appreciation: ${h.previousAppreciation}% → ${h.newAppreciation}%`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {format(new Date(h.changedAt), 'PPp')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No price history</p>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Maintenance History</h3>
              {uiProperty.maintenanceHistory.length > 0 ? (
                <div className="space-y-3">
                  {uiProperty.maintenanceHistory.map((h: any) => (
                    <div key={h.id} className="p-4 text-sm border border-gray-200 rounded-lg">
                      <p className="font-medium text-gray-900">{h.changeReason}</p>
                      <p className="text-gray-600">
                        {h.previousAmount !== null
                          ? `Amount: $${h.previousAmount} → $${h.newAmount}`
                          : `New: $${h.newAmount} (${h.newChargeType})`}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {format(new Date(h.changedAt), 'PPp')}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No maintenance history</p>
              )}
            </div>
          </div>
        )}

        {/* Calendar */}
        {activeTab === 'calendar' && (
          <div>
            <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
              <Calendar className="w-5 h-5 mr-2" />
              Booking Calendar
            </h3>
            <div className="p-6 text-center rounded-lg bg-gray-50">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-sm text-gray-600">Booking calendar integration coming soon</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
