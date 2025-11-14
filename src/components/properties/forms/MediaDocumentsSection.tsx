import FileUploadZone from '../FileUploadZone';
import FormInput from '../../ui/propertiesFormInput';
import { X } from 'lucide-react';
import { formatFileSize } from '@/utils/fileValidation';

interface MediaDocumentsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;

  // NEW files
  imageFiles: File[];
  setImageFiles: (f: File[]) => void;
  videoFiles: File[];
  setVideoFiles: (f: File[]) => void;
  documentFiles: File[];
  setDocumentFiles: (f: File[]) => void;

  // Dropzones
  imageDropzone: any;
  videoDropzone: any;
  documentDropzone: any;

  // Helper
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;

  // Existing media from DB
  existingImages: any[];
  existingVideos: any[];
  existingDocuments: any[];

  // Callbacks that push IDs into the “to-delete” arrays
  onRemoveExistingImage: (id: string) => void;
  onRemoveExistingVideo: (id: string) => void;
  onRemoveExistingDocument: (id: string) => void;
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
  existingImages = [],
  existingVideos = [],
  existingDocuments = [],
  onRemoveExistingImage,
  onRemoveExistingVideo,
  onRemoveExistingDocument,
}: MediaDocumentsSectionProps) {
  /* --------------------------------------------------------------------- */
  /* Helper: render a single existing media item (image / video / doc)    */
  /* --------------------------------------------------------------------- */
  const ExistingItem = ({ item, onRemove }: { item: any; onRemove: (id: string) => void }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded bg-gray-50">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{item.name ?? item.url.split('/').pop()}</p>
        {item.size != null && <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>}
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Media & Documents</h2>

      {/* ---------- IMAGES ---------- */}
      <div className="mb-8">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Property Images (max 20) *</h3>

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div className="mb-3 space-y-2">
            {existingImages.map((img) => (
              <ExistingItem key={img.id} item={img} onRemove={onRemoveExistingImage} />
            ))}
          </div>
        )}

        {/* Upload zone */}
        <FileUploadZone
          label="" // label is already rendered above
          dropzone={imageDropzone}
          files={imageFiles}
          onRemove={(idx) => removeAt(idx, imageFiles, setImageFiles, 'propertyImages')}
          error={errors.propertyImages}
        />
      </div>

      {/* ---------- VIDEOS ---------- */}
      <div className="mb-8">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Property Videos (max 5)</h3>

        {existingVideos.length > 0 && (
          <div className="mb-3 space-y-2">
            {existingVideos.map((vid) => (
              <ExistingItem key={vid.id} item={vid} onRemove={onRemoveExistingVideo} />
            ))}
          </div>
        )}

        <FileUploadZone
          label=""
          dropzone={videoDropzone}
          files={videoFiles}
          onRemove={(idx) => removeAt(idx, videoFiles, setVideoFiles, 'propertyVideos')}
          error={errors.propertyVideos}
        />
      </div>

      {/* ---------- DOCUMENTS ---------- */}
      <div className="mb-8">
        <h3 className="mb-2 text-sm font-medium text-gray-700">Documents (max 10)</h3>

        {existingDocuments.length > 0 && (
          <div className="mb-3 space-y-2">
            {existingDocuments.map((doc) => (
              <ExistingItem key={doc.id} item={doc} onRemove={onRemoveExistingDocument} />
            ))}
          </div>
        )}

        <FileUploadZone
          label=""
          dropzone={documentDropzone}
          files={documentFiles}
          onRemove={(idx) => removeAt(idx, documentFiles, setDocumentFiles, 'documents')}
          error={errors.documents}
        />
      </div>

      {/* Document names (comma-separated) */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormInput
          id="documentNames"
          label="Document Names (comma-separated)"
          placeholder="e.g., Sale Deed, NOC, Tax Receipt"
          inputProps={register('documentNames')}
          error={errors.documentNames}
        />
      </div>
    </div>
  );
}
