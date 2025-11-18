import FileUploadZone from '../FileUploadZone';
import FormInput from '../../ui/propertiesFormInput';
import { X, Image, Video, FileText, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { formatFileSize } from '@/utils/fileValidation';
import { useEffect, useState, memo, useCallback } from 'react';

interface MediaDocumentsSectionProps {
  register: any;
  errors: any;
  setValue: any;
  getValues: any;
  isSubmitting?: boolean;

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
  existingImages?: any[];
  existingVideos?: any[];
  existingDocuments?: any[];

  // Callbacks that push IDs into the "to-delete" arrays
  onRemoveExistingImage?: (id: string) => void;
  onRemoveExistingVideo?: (id: string) => void;
  onRemoveExistingDocument?: (id: string) => void;
}

interface DocumentItem {
  id?: string; // for existing documents
  name: string;
  file?: File; // for new uploads
  isExisting?: boolean;
  uniqueId: string; // stable unique identifier for React keys
}

interface DocumentItemRowProps {
  item: DocumentItem;
  index: number;
  onUpdate: (index: number, name: string) => void;
  onRemove: (index: number) => void;
  isSubmitting?: boolean;
}

const DocumentItemRow = memo(
  ({ item, index, onUpdate, onRemove, isSubmitting }: DocumentItemRowProps) => (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="shrink-0">
        {item.isExisting ? (
          <FileText className="w-5 h-5 text-green-600" />
        ) : (
          <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
            <Plus className="w-3 h-3 text-blue-600" />
          </div>
        )}
      </div>

      <div className="flex-1">
        <input
          type="text"
          value={item.name}
          onChange={(e) => onUpdate(index, e.target.value)}
          placeholder="Enter document name (e.g., Sale Deed)"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isSubmitting}
        />
        {item.file && (
          <p className="text-xs text-gray-500 mt-1">
            {item.file.name} ({formatFileSize(item.file.size)})
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="shrink-0 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
        title="Remove document"
        disabled={isSubmitting}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ),
);

DocumentItemRow.displayName = 'DocumentItemRow';

export default function MediaDocumentsSection({
  register,
  errors,
  setValue,
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
  isSubmitting,
}: MediaDocumentsSectionProps) {
  const [documentItems, setDocumentItems] = useState<DocumentItem[]>([]);

  // Initialize document items when component mounts or existing documents/files change
  useEffect(() => {
    setDocumentItems((prev) => {
      const updatedItems: DocumentItem[] = [];
      const previousMap = new Map(prev.map((item) => [item.uniqueId, item]));

      // Add existing documents
      existingDocuments.forEach((doc) => {
        updatedItems.push({
          id: doc.id,
          name: doc.name,
          isExisting: true,
          uniqueId: doc.id || `existing-${doc.id}`,
        });
      });

      // Add new uploaded files - preserve their names if they were entered before
      documentFiles.forEach((file, index) => {
        const uniqueId = `new-file-${file.name}-${file.size}-${index}`;
        const previousItem = previousMap.get(uniqueId);
        updatedItems.push({
          name: previousItem?.name || '', // Preserve previous name if it exists
          file,
          isExisting: false,
          uniqueId,
        });
      });

      return updatedItems;
    });
  }, [existingDocuments, documentFiles]);

  // Update documentNames whenever documentItems change
  useEffect(() => {
    const names = documentItems
      .filter((item) => item.name.trim() !== '')
      .map((item) => item.name.trim());
    const commaSeparatedNames = names.join(', ');
    setValue('documentNames', commaSeparatedNames);
  }, [documentItems, setValue]);

  const updateDocumentName = useCallback((index: number, name: string) => {
    setDocumentItems((prev) => prev.map((item, i) => (i === index ? { ...item, name } : item)));
  }, []);

  const removeDocumentItem = useCallback(
    (index: number) => {
      setDocumentItems((prev) => {
        const item = prev[index];

        if (item.isExisting && item.id) {
          // Remove existing document
          onRemoveExistingDocument?.(item.id);
        } else if (item.file) {
          // Remove new uploaded file
          const fileIndex = documentFiles.findIndex((f) => f === item.file);
          if (fileIndex !== -1) {
            removeAt(fileIndex, documentFiles, setDocumentFiles, 'documents');
          }
        }

        // Remove from local state
        return prev.filter((_, i) => i !== index);
      });
    },
    [documentFiles, removeAt, setDocumentFiles, onRemoveExistingDocument],
  );

  /* --------------------------------------------------------------------- */
  /* Helper: render a single existing media item (image / video / doc)    */
  /* --------------------------------------------------------------------- */
  const ExistingItem = ({
    item,
    onRemove,
    type,
  }: {
    item: any;
    onRemove: (id: string) => void;
    type: string;
  }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {type === 'image' && <Image className="w-4 h-4 text-blue-500 shrink-0" />}
        {type === 'video' && <Video className="w-4 h-4 text-purple-500 shrink-0" />}
        {type === 'document' && <FileText className="w-4 h-4 text-green-500 shrink-0" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 truncate">{item.name ?? item.url.split('/').pop()}</p>
          {item.size != null && (
            <p className="text-xs text-gray-500">{formatFileSize(item.size)}</p>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(item.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0 p-1 hover:bg-red-50 rounded transition-colors"
        title="Remove file"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ========== PRIMARY MEDIA ========== */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Image className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Primary Media</h3>
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Required</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-medium text-gray-700">Property Images</h4>
                <span className="text-xs text-red-500">*</span>
              </div>
              <span className="text-xs text-gray-500">Max 20 • JPG, PNG, WebP, GIF</span>
            </div>

            {existingImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Existing Images:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {existingImages.map((img) => (
                    <ExistingItem
                      key={img.id}
                      item={img}
                      onRemove={onRemoveExistingImage || (() => {})}
                      type="image"
                    />
                  ))}
                </div>
              </div>
            )}

            <FileUploadZone
              label=""
              dropzone={imageDropzone}
              files={imageFiles}
              onRemove={(idx) => removeAt(idx, imageFiles, setImageFiles, 'propertyImages')}
              error={errors.propertyImages}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Property Videos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Video className="w-4 h-4 text-purple-600" />
                <h4 className="text-sm font-medium text-gray-700">Property Videos</h4>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  Optional
                </span>
              </div>
              <span className="text-xs text-gray-500">Max 5 • MP4, MOV, AVI</span>
            </div>

            {existingVideos.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-600 font-medium">Existing Videos:</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {existingVideos.map((vid) => (
                    <ExistingItem
                      key={vid.id}
                      item={vid}
                      onRemove={onRemoveExistingVideo || (() => {})}
                      type="video"
                    />
                  ))}
                </div>
              </div>
            )}

            <FileUploadZone
              label=""
              dropzone={videoDropzone}
              files={videoFiles}
              onRemove={(idx) => removeAt(idx, videoFiles, setVideoFiles, 'propertyVideos')}
              error={errors.propertyVideos}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* ========== DOCUMENTS ========== */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-medium text-gray-900">Documents</h3>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Optional</span>
        </div>

        {/* Upload Zone */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-700">Upload Document Files</h4>
            <span className="text-xs text-gray-500">
              Max 10 • PDF, DOC, DOCX, XLS, XLSX, Images
            </span>
          </div>

          <FileUploadZone
            label=""
            dropzone={documentDropzone}
            files={documentFiles}
            onRemove={(idx) => {
              // Remove from files array, the useEffect will handle updating documentItems
              removeAt(idx, documentFiles, setDocumentFiles, 'documents');
            }}
            error={errors.documents}
            isSubmitting={isSubmitting}
          />

          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-800">
              <strong>Tip:</strong> Upload document files first, then enter the document names below
              for each one.
            </p>
          </div>
        </div>

        {/* Document Items */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Document Details {documentItems.length > 0 && `(${documentItems.length})`}
          </h4>
          {documentItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No documents added yet</p>
              <p className="text-xs">Upload document files above to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documentItems.map((item, index) => (
                <DocumentItemRow
                  key={item.uniqueId}
                  item={item}
                  index={index}
                  onUpdate={updateDocumentName}
                  onRemove={removeDocumentItem}
                  isSubmitting={isSubmitting}
                />
              ))}
            </div>
          )}{' '}
          {/* Hidden field for comma-separated names (for backend compatibility) */}
          <input type="hidden" {...register('documentNames')} />
          {errors.documentNames && (
            <p className="mt-2 text-sm text-red-600">{errors.documentNames.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
