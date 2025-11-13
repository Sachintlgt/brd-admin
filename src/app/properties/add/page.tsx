"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

import DashboardLayout from "../../../components/DashboardLayout";
import { usePropertyForm } from "../../../hooks/usePropertyForm";
import BasicInformationSection from "../../../components/properties/forms/BasicInformationSection";
import SharesPricingSection from "../../../components/properties/forms/SharesPricingSection";
import MediaDocumentsSection from "../../../components/properties/forms/MediaDocumentsSection";
import AmenitiesSection from "../../../components/properties/forms/AmenitiesSection";
import StatusSection from "../../../components/properties/forms/StatusSection";

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
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Link>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {submitSuccess && (
        <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 border border-green-200 p-4">
          <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm text-green-800">{submitSuccess}</p>
        </div>
      )}

      {/* Error Alert */}
      {submitError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 border border-red-200 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-sm text-red-800 whitespace-pre-wrap">{submitError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <BasicInformationSection 
          register={formProps.register}
          errors={formProps.errors}
        />
        <SharesPricingSection 
          register={formProps.register}
          errors={formProps.errors}
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
        <StatusSection 
          register={formProps.register}
          errors={formProps.errors}
        />

        <div className="flex justify-end space-x-4">
          <Link
            href="/properties"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
