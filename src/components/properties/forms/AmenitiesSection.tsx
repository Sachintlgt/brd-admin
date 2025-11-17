import { formatFileSize } from '@/utils/fileValidation';
import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';
import { X } from 'lucide-react';

interface AmenitiesSectionProps {
  register: any;
  errors: any;
  setValue?: any;
  getValues?: any;

  // Icons upload
  iconDropzone: any;
  iconFiles: File[];
  setIconFiles: (f: File[]) => void;

  // Helper
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;

  // Existing amenities from DB
  existingAmenities?: any[];
  onRemoveExisting?: (id: string) => void; // removeExistingAmenity

  // Form submission
  isSubmitting: boolean;
}

export default function AmenitiesSection({
  register,
  errors,
  iconDropzone,
  iconFiles,
  setIconFiles,
  removeAt,
  setValue,
  getValues,
  existingAmenities = [],
  onRemoveExisting,
  isSubmitting,
}: AmenitiesSectionProps) {
  /* --------------------------------------------------------------------- */
  /* Helper: render a single existing amenity icon                         */
  /* --------------------------------------------------------------------- */
  const ExistingIcon = ({ amenity }: { amenity: any }) => (
    <div className="flex items-center justify-between px-3 py-2 border border-gray-200 rounded bg-gray-50">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700 truncate">{amenity.name}</p>
        {amenity.icon?.size != null && (
          <p className="text-xs text-gray-500">{formatFileSize(amenity.icon.size)}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onRemoveExisting?.(amenity.id)}
        className="ml-2 text-red-500 hover:text-red-700 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Amenities</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Amenity names */}
        <FormInput
          id="amenityNames"
          label="Amenity Names (comma-separated)"
          placeholder="Pool, Gym, Parking"
          inputProps={register('amenityNames')}
          error={errors.amenityNames}
        />

        {/* Amenity icons */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Amenity Icons (optional, must match amenityNames count)
          </label>

          {/* Existing icons */}
          {existingAmenities.length > 0 && (
            <div className="mb-3 space-y-2">
              {existingAmenities.map((a) => (
                <ExistingIcon key={a.id} amenity={a} />
              ))}
            </div>
          )}

          {/* Upload zone */}
          <FileUploadZone
            label="" // label rendered above
            dropzone={iconDropzone}
            files={iconFiles}
            onRemove={(idx) => removeAt(idx, iconFiles, setIconFiles, 'amenityIcons')}
            error={errors.amenityIcons}
            isSubmitting={isSubmitting}
          />
          {errors.amenityIcons && (
            <p className="mt-2 text-sm text-red-600">{errors.amenityIcons.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
