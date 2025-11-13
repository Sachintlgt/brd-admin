import FileUploadZone from "../FileUploadZone";
import FormInput from "../../ui/propertiesFormInput";

interface MediaDocumentsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  imageFiles: File[];
  setImageFiles: (files: File[]) => void;
  videoFiles: File[];
  setVideoFiles: (files: File[]) => void;
  documentFiles: File[];
  setDocumentFiles: (files: File[]) => void;
  imageDropzone: any;
  videoDropzone: any;
  documentDropzone: any;
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;
}

export default function MediaDocumentsSection({
  register,
  errors,
  imageFiles,
  setImageFiles,
  videoFiles,
  setVideoFiles,
  documentFiles,
  setDocumentFiles,
  imageDropzone,
  videoDropzone,
  documentDropzone,
  removeAt,
}: MediaDocumentsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Media & Documents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FileUploadZone
          label="Property Images (max 20) *"
          dropzone={imageDropzone}
          files={imageFiles}
          onRemove={(idx) => removeAt(idx, imageFiles, setImageFiles, "propertyImages")}
          error={errors.propertyImages}
        />
        <FileUploadZone
          label="Property Videos (max 5)"
          dropzone={videoDropzone}
          files={videoFiles}
          onRemove={(idx) => removeAt(idx, videoFiles, setVideoFiles, "propertyVideos")}
          error={errors.propertyVideos}
        />
        <FileUploadZone
          label="Documents (max 10)"
          dropzone={documentDropzone}
          files={documentFiles}
          onRemove={(idx) => removeAt(idx, documentFiles, setDocumentFiles, "documents")}
          error={errors.documents}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <FormInput
          id="documentNames"
          label="Document Names (comma-separated)"
          placeholder="e.g., Sale Deed, NOC, Tax Receipt"
          inputProps={register("documentNames")}
          error={errors.documentNames}
        />
      </div>
    </div>
  );
}
