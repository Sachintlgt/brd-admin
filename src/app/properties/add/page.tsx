'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import DashboardLayout from '../../../components/DashboardLayout';
import { usePropertyForm } from '../../../hooks/usePropertyForm';
import BasicInformationSection from '../../../components/properties/forms/BasicInformationSection';
import SharesPricingSection from '../../../components/properties/forms/SharesPricingSection';
import MediaDocumentsSection from '../../../components/properties/forms/MediaDocumentsSection';
import AmenitiesSection from '../../../components/properties/forms/AmenitiesSection';
import StatusSection from '../../../components/properties/forms/StatusSection';
import PricingDetailsSection from '@/components/properties/forms/PricingDetailsSection';
import ShareDetailsSection from '@/components/properties/forms/ShareDetailsSection';
import MaintenanceTemplatesSection from '@/components/properties/forms/MaintenanceTemplatesSection';

export default function AddProperty() {
  const router = useRouter();
  const formProps = usePropertyForm(router);

  const { handleSubmit, onSubmit, isSubmitting, submitError, submitSuccess } = formProps;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/properties"
              className="inline-flex items-center px-3 py-2 text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {submitSuccess && (
        <div className="flex items-center gap-3 p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">{submitSuccess}</p>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="flex items-start gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 whitespace-pre-wrap">{submitError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BasicInformationSection register={formProps.register} errors={formProps.errors} />
        <SharesPricingSection register={formProps.register} errors={formProps.errors} />
        {/*  Pricing Details Section */}
        <PricingDetailsSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
        />

        {/*  Share Details Section */}
        <ShareDetailsSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
        />

        {/* Maintenance Templates Section */}
        <MaintenanceTemplatesSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
        />

        <MediaDocumentsSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
          imageFiles={formProps.imageFiles}
          setImageFiles={formProps.setImageFiles}
          videoFiles={formProps.videoFiles}
          setVideoFiles={formProps.setVideoFiles}
          documentFiles={formProps.documentFiles}
          setDocumentFiles={formProps.setDocumentFiles}
          imageDropzone={formProps.imageDropzone}
          videoDropzone={formProps.videoDropzone}
          documentDropzone={formProps.documentDropzone}
          removeAt={formProps.removeAt}
        />
        <AmenitiesSection
          register={formProps.register}
          errors={formProps.errors}
          iconDropzone={formProps.iconDropzone}
          iconFiles={formProps.iconFiles}
          setIconFiles={formProps.setIconFiles}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
          removeAt={formProps.removeAt}
        />
        <StatusSection register={formProps.register} errors={formProps.errors} />

        <div className="flex justify-end space-x-4">
          <Link
            href="/properties"
            className="px-6 py-3 font-medium text-gray-700 transition-colors duration-200 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-3 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Property
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
