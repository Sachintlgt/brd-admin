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
  Home,
  Bath,
  Square,
  User,
  Target,
  Percent,
  Receipt,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { propertyService } from '@/services/propertyService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { useProperties } from '@/app/context/PropertiesContext';
import DashboardLayout from '@/components/DashboardLayout';

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
        const response = await propertyService.getPropertyById(id as string);
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
    // Property specs
    beds: property.beds,
    bathrooms: property.bathrooms,
    sqft: property.sqft,
    maxOccupancy: property.maxOccupancy,
    // Pricing info
    totalShares: property.totalShares,
    availableShares: property.availableShares,
    soldShares: property.soldShares,
    occupancyRate: property.occupancyRate,
    initialPricePerShare: property.initialPricePerShare,
    currentPricePerShare: property.currentPricePerShare,
    wholeUnitPrice: property.wholeUnitPrice,
    appreciationRate: property.appreciationRate,
    targetIRR: property.targetIRR,
    targetRentalYield: property.targetRentalYield,
    // Dates
    possessionDate: property.possessionDate,
    launchDate: property.launchDate,
    createdAt: property.createdAt,
    updatedAt: property.updatedAt,
    // Booking
    maxBookingDays: property.maxBookingDays,
    bookingAmount: property.bookingAmount,
    bookingAmountGST: property.bookingAmountGST,
    // Other data
    oneTimePricing: property.pricings?.find((p: any) => p.type === 'ONE_TIME')?.price || 0,
    maintenanceCharges: property.maintenanceTemplates?.find((t: any) => t.isActive)?.amount || 0,
    appreciationPrice: property.appreciationRate,
    phaseWisePricing: property.pricings?.filter((p: any) => p.phaseName) || [],
    paymentPlans: property.paymentPlans || [],
    photos:
      property.images?.filter((i: any) => i.type === 'image').map((i: any) => BASE_URL + i.url) ||
      [],
    videos:
      property.images?.filter((i: any) => i.type === 'video').map((i: any) => BASE_URL + i.url) ||
      [],
    legalDocuments: property.documents || [],
    certificates: property.certificates || [],
    floorPlans: property.floorPlans || [],
    highlights: property.highlights || [],
    amenities: property.amenities?.map((a: any) => a.name) || [],
    shareDetails: property.shareDetails || [],
    maintenanceTemplates: property.maintenanceTemplates || [],
  };

  const assignedStaff = property.assignedStaff?.map((staffId: string) =>
    staff.find((s: any) => s.id === staffId)
  ).filter(Boolean) || [];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: FileText },
    { id: 'pricing', name: 'Pricing', icon: DollarSign },
    { id: 'media', name: 'Media', icon: ImageIcon },
    { id: 'documents', name: 'Documents', icon: File },
    { id: 'maintenance', name: 'Maintenance', icon: Clock },
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
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                    {assignedStaff.length > 0
                      ? assignedStaff.map((s: any) => s.name).join(', ')
                      : 'Not assigned'
                    }
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Beds</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.beds || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Bathrooms</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.bathrooms || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Square Feet</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.sqft ? uiProperty.sqft.toLocaleString() : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Occupancy</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.maxOccupancy || 'N/A'}</dd>
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

            {/* Financial Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Financial Information</h3>
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Initial Price Per Share</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.initialPricePerShare ? `$${uiProperty.initialPricePerShare.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Current Price Per Share</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.currentPricePerShare ? `$${uiProperty.currentPricePerShare.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Whole Unit Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.wholeUnitPrice ? `$${uiProperty.wholeUnitPrice.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Appreciation Rate</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.appreciationRate}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Target IRR</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.targetIRR ? `${uiProperty.targetIRR}%` : 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Target Rental Yield</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.targetRentalYield ? `${uiProperty.targetRentalYield}%` : 'N/A'}</dd>
                </div>
              </dl>
            </div>

            {/* Booking Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Booking Information</h3>
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Booking Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.bookingAmount ? `$${uiProperty.bookingAmount.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Booking Amount GST</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.bookingAmountGST ? `$${uiProperty.bookingAmountGST.toLocaleString()}` : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Max Booking Days</dt>
                  <dd className="mt-1 text-sm text-gray-900">{uiProperty.maxBookingDays || 'N/A'}</dd>
                </div>
              </dl>
            </div>

            {/* Important Dates */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Important Dates</h3>
              <dl className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Launch Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.launchDate ? format(new Date(uiProperty.launchDate), 'PPP') : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Possession Date</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.possessionDate ? format(new Date(uiProperty.possessionDate), 'PPP') : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.createdAt ? format(new Date(uiProperty.createdAt), 'PPP') : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Updated At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {uiProperty.updatedAt ? format(new Date(uiProperty.updatedAt), 'PPP') : 'N/A'}
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
            {uiProperty.shareDetails && uiProperty.shareDetails.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                   Shares Details
                </h3>
                <div className="space-y-3">
                  {uiProperty.shareDetails.map((share: any, index: number) => (
                    <div
                      key={share.id || index}
                      className="p-4 border border-gray-200 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">{share.title}</h4>
                          {share.description && (
                            <p className="text-sm text-gray-600 mb-2">{share.description}</p>
                          )}
                          {share.benefits && (
                            <p className="text-sm text-gray-500 mb-2">
                              <span className="font-medium">Benefits:</span> {share.benefits}
                            </p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-lg font-semibold text-gray-900">
                            ${share.amount?.toLocaleString() || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {share.shareCount} share{share.shareCount !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

            {uiProperty.paymentPlans.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-semibold text-gray-900">Payment Plans</h3>
                <div className="space-y-4">
                  {uiProperty.paymentPlans.map((plan: any, i: number) => (
                    <div key={plan.id || i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{plan.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-900">
                            ${plan.amount?.toLocaleString() || 'N/A'}
                          </div>
                          {plan.percentage && (
                            <div className="text-sm text-gray-600">
                              {plan.percentage}% of total
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Type:</span>
                          <div className="text-gray-900">{plan.planType}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Purchase Type:</span>
                          <div className="text-gray-900">{plan.purchaseType}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Milestone:</span>
                          <div className="text-gray-900">{plan.milestone}</div>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Due Date:</span>
                          <div className="text-gray-900">
                            {plan.dueDate ? format(new Date(plan.dueDate), 'PP') : 'N/A'}
                          </div>
                        </div>
                      </div>
                      {(plan.isGSTIncluded || plan.gstPercentage) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center space-x-4 text-sm">
                            {plan.isGSTIncluded && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                GST Included
                              </span>
                            )}
                            {plan.gstPercentage && (
                              <span className="text-gray-600">
                                GST: {plan.gstPercentage}%
                              </span>
                            )}
                          </div>
                        </div>
                      )}
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

            <div>
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <File className="w-5 h-5 mr-2" />
                Certificates ({uiProperty.certificates.length})
              </h3>
              {uiProperty.certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiProperty.certificates.map((cert: any, i: number) => (
                    <div key={cert.id || i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <img
                          src={BASE_URL + cert.imageUrl}
                          alt={cert.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{cert.name}</h4>
                      {cert.description && (
                        <p className="text-sm text-gray-600">{cert.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No certificates uploaded</p>
              )}
            </div>

            <div>
              <h3 className="flex items-center mb-4 text-lg font-semibold text-gray-900">
                <Home className="w-5 h-5 mr-2" />
                Floor Plans ({uiProperty.floorPlans.length})
              </h3>
              {uiProperty.floorPlans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uiProperty.floorPlans.map((plan: any, i: number) => (
                    <div key={plan.id || i} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="aspect-square mb-3 overflow-hidden rounded-lg">
                        <img
                          src={BASE_URL + plan.imageUrl}
                          alt={plan.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{plan.name}</h4>
                      {plan.description && (
                        <p className="text-sm text-gray-600">{plan.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No floor plans uploaded</p>
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
                          {tmpl.startDate && !isNaN(new Date(tmpl.startDate).getTime())
                            ? format(new Date(tmpl.startDate), 'PP')
                            : 'Invalid start date'
                          } –{' '}
                          {tmpl.endDate && !isNaN(new Date(tmpl.endDate).getTime())
                            ? format(new Date(tmpl.endDate), 'PP')
                            : 'Ongoing'
                          }
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
