'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

import DashboardLayout from '@/components/DashboardLayout';
import { usePropertyForm } from '@/hooks/usePropertyForm';
import BasicInformationSection from '@/components/properties/forms/BasicInformationSection';
import SharesPricingSection from '@/components/properties/forms/SharesPricingSection';
import MediaDocumentsSection from '@/components/properties/forms/MediaDocumentsSection';
import AmenitiesSection from '@/components/properties/forms/AmenitiesSection';
import StatusSection from '@/components/properties/forms/StatusSection';
import PricingDetailsSection from '@/components/properties/forms/PricingDetailsSection';
import ShareDetailsSection from '@/components/properties/forms/ShareDetailsSection';
import MaintenanceTemplatesSection from '@/components/properties/forms/MaintenanceTemplatesSection';
import CertificatesSection from '@/components/properties/forms/CertificatesSection';
import FloorPlansSection from '@/components/properties/forms/FloorPlansSection';
import PaymentPlansSection from '@/components/properties/forms/PaymentPlansSection';

export default function EditProperty() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const formProps = usePropertyForm(router, propertyId);

  const { handleSubmit, onSubmit, isSubmitting, submitError, submitSuccess, isLoading } = formProps;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="py-12 text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading property...</p>
        </div>
      </DashboardLayout>
    );
  }

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

      {submitSuccess && (
        <div className="flex items-center gap-3 p-4 mb-6 border border-green-200 rounded-lg bg-green-50">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">{submitSuccess}</p>
        </div>
      )}

      {submitError && (
        <div className="flex items-start gap-3 p-4 mb-6 border border-red-200 rounded-lg bg-red-50">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 whitespace-pre-wrap">{submitError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BasicInformationSection register={formProps.register} errors={formProps.errors} control={formProps.control} setValue={formProps.setValue} getValues={formProps.getValues} />
        <SharesPricingSection register={formProps.register} errors={formProps.errors} />

        <CertificatesSection
          register={formProps.register}
          errors={formProps.errors}
          certificateImageDropzone={formProps.certificateImageDropzone}
          certificateImageFiles={formProps.certificateImageFiles}
          setCertificateImageFiles={formProps.setCertificateImageFiles}
          removeAt={formProps.removeAt}
          existingCertificates={formProps.existingCertificates}
          onRemoveExisting={formProps.removeExistingCertificate}
          isSubmitting={isSubmitting}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
        />
        <FloorPlansSection
          register={formProps.register}
          errors={formProps.errors}
          floorPlanImageDropzone={formProps.floorPlanImageDropzone}
          floorPlanImageFiles={formProps.floorPlanImageFiles}
          setFloorPlanImageFiles={formProps.setFloorPlanImageFiles}
          removeAt={formProps.removeAt}
          existingFloorPlans={formProps.existingFloorPlans}
          onRemoveExisting={formProps.removeExistingFloorPlan}
          isSubmitting={isSubmitting}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
        />
        <PaymentPlansSection
          register={formProps.register}
          errors={formProps.errors}
          control={formProps.control}
          getValues={formProps.getValues}
        />

        <PricingDetailsSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
          control={formProps.control}
        />

        <ShareDetailsSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
          control={formProps.control}
        />

        <MaintenanceTemplatesSection
          register={formProps.register}
          errors={formProps.errors}
          setValue={formProps.setValue}
          getValues={formProps.getValues}
          control={formProps.control}
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
          existingImages={formProps.existingImages}
          existingVideos={formProps.existingVideos}
          existingDocuments={formProps.existingDocuments}
          onRemoveExistingImage={formProps.removeExistingImage}
          onRemoveExistingVideo={formProps.removeExistingVideo}
          onRemoveExistingDocument={formProps.removeExistingDocument}
          isSubmitting={isSubmitting}
        />

        <AmenitiesSection
          register={formProps.register}
          errors={formProps.errors}
          iconDropzone={formProps.iconDropzone}
          iconFiles={formProps.iconFiles}
          setIconFiles={formProps.setIconFiles}
          removeAt={formProps.removeAt}
          existingAmenities={formProps.existingAmenities}
          onRemoveExisting={formProps.removeExistingAmenity}
          isSubmitting={isSubmitting}
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
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Property
              </>
            )}
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}
