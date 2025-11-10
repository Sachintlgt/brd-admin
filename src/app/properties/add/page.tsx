'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useProperties } from '../../context/PropertiesContext';
import { Property } from '../../types/property';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Plus, ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DashboardLayout from '../../../components/DashboardLayout';

type PropertyFormData = Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;

export default function AddProperty() {
  const { addProperty, staff } = useProperties();
  const router = useRouter();
  const { register, handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    defaultValues: {
      name: '',
      description: '',
      location: '',
      amenities: [],
      photos: [],
      videos: [],
      oneTimePricing: 0,
      phaseWisePricing: [{ phase: '', price: 0 }],
      purchasedSharesDetails: '',
      legalDocuments: [],
      assignedStaff: '',
      maintenanceCharges: 0,
      appreciationPrice: 0,
      isActive: true,
      isFeatured: false,
    },
  });

  const { fields: phaseFields, append: appendPhase, remove: removePhase } = useFieldArray({
    control,
    name: 'phaseWisePricing',
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [amenitiesInput, setAmenitiesInput] = useState('');

  const onPhotoDrop = (acceptedFiles: File[]) => {
    setPhotos(prev => [...prev, ...acceptedFiles]);
    setValue('photos', [...getValues('photos'), ...acceptedFiles.map(f => f.name)]);
  };

  const onVideoDrop = (acceptedFiles: File[]) => {
    setVideos(prev => [...prev, ...acceptedFiles]);
    setValue('videos', [...getValues('videos'), ...acceptedFiles.map(f => f.name)]);
  };

  const onDocumentDrop = (acceptedFiles: File[]) => {
    setDocuments(prev => [...prev, ...acceptedFiles]);
    setValue('legalDocuments', [...getValues('legalDocuments'), ...acceptedFiles.map(f => f.name)]);
  };

  const photoDropzone = useDropzone({ onDrop: onPhotoDrop, accept: { 'image/*': [] } });
  const videoDropzone = useDropzone({ onDrop: onVideoDrop, accept: { 'video/*': [] } });
  const documentDropzone = useDropzone({ onDrop: onDocumentDrop, accept: { 'application/*': [] } });

  const handleAddAmenity = () => {
    if (amenitiesInput.trim()) {
      const currentAmenities = getValues('amenities') || [];
      setValue('amenities', [...currentAmenities, amenitiesInput.trim()]);
      setAmenitiesInput('');
    }
  };

  const removeAmenity = (index: number) => {
    const currentAmenities = getValues('amenities') || [];
    setValue('amenities', currentAmenities.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      addProperty(data);
      router.push('/properties');
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
              <p className="mt-2 text-gray-600">Fill in the details to add a new property to your portfolio</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                {...register('name', { required: 'Property name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter property name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                {...register('location', { required: 'Location is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Enter property location"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              placeholder="Describe the property..."
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={amenitiesInput}
                onChange={(e) => setAmenitiesInput(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Add amenity (e.g., Pool, Gym)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAmenity())}
              />
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {getValues('amenities') && getValues('amenities').length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {getValues('amenities').map((amenity, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {amenity}
                    <button
                      type="button"
                      onClick={() => removeAmenity(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                One Time Price ($)
              </label>
              <input
                type="number"
                {...register('oneTimePricing', { valueAsNumber: true, min: 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Charges ($/month)
              </label>
              <input
                type="number"
                {...register('maintenanceCharges', { valueAsNumber: true, min: 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Appreciation Price ($)
              </label>
              <input
                type="number"
                {...register('appreciationPrice', { valueAsNumber: true, min: 0 })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="0"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Phase-wise Pricing
            </label>
            <div className="space-y-3">
              {phaseFields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <div className="flex-1">
                    <input
                      {...register(`phaseWisePricing.${index}.phase`)}
                      placeholder="Phase name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      {...register(`phaseWisePricing.${index}.price`, { valueAsNumber: true })}
                      placeholder="Price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhase(index)}
                    className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => appendPhase({ phase: '', price: 0 })}
              className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Phase
            </button>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Media & Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos
              </label>
              <div
                {...photoDropzone.getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
              >
                <input {...photoDropzone.getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drop photos here or click to upload</p>
              </div>
              {photos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {photos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotos(prev => prev.filter((_, i) => i !== index));
                          setValue('photos', getValues('photos').filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Videos
              </label>
              <div
                {...videoDropzone.getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
              >
                <input {...videoDropzone.getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drop videos here or click to upload</p>
              </div>
              {videos.length > 0 && (
                <div className="mt-3 space-y-2">
                  {videos.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideos(prev => prev.filter((_, i) => i !== index));
                          setValue('videos', getValues('videos').filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Legal Documents
              </label>
              <div
                {...documentDropzone.getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors duration-200"
              >
                <input {...documentDropzone.getInputProps()} />
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drop documents here or click to upload</p>
              </div>
              {documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setDocuments(prev => prev.filter((_, i) => i !== index));
                          setValue('legalDocuments', getValues('legalDocuments').filter((_, i) => i !== index));
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assigned Staff
              </label>
              <select
                {...register('assignedStaff')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="">Select Staff Member</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchased Shares Details
              </label>
              <textarea
                {...register('purchasedSharesDetails')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="Details about purchased shares..."
              />
            </div>
          </div>

          <div className="mt-6 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isActive')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-3 text-sm text-gray-700">Active Property</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isFeatured')}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="ml-3 text-sm text-gray-700">Featured Property</span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/properties"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Property
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}