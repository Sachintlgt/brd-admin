import FormInput from '../../ui/propertiesFormInput';
import FileUploadZone from '../FileUploadZone';

interface AmenitiesSectionProps {
  register: any;
  errors: any;
  iconDropzone: any;
  iconFiles: File[];
  setIconFiles: (files: File[]) => void;
  setValue: any;
  getValues: any;
  removeAt: (idx: number, files: File[], setFiles: (f: File[]) => void, formKey: any) => void;
}

export default function AmenitiesSection({
  register,
  errors,
  iconDropzone,
  iconFiles,
  setIconFiles,
  removeAt,
}: AmenitiesSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Amenities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          id="amenityNames"
          label="Amenity Names (comma-separated)"
          placeholder="Pool, Gym, Parking"
          inputProps={register('amenityNames')}
          error={errors.amenityNames}
        />
        <FileUploadZone
          label="Amenity Icons (optional, must match amenityNames count)"
          dropzone={iconDropzone}
          files={iconFiles}
          onRemove={(idx) => removeAt(idx, iconFiles, setIconFiles, 'amenityIcons')}
          error={errors.amenityIcons}
        />
      </div>
    </div>
  );
}
