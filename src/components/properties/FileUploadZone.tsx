import { Upload, X } from 'lucide-react';
import { formatFileSize } from '../../utils/fileValidation';

interface FileUploadZoneProps {
  label: string;
  dropzone: any;
  files: File[];
  onRemove: (index: number) => void;
  error?: any;
}

export default function FileUploadZone({
  label,
  dropzone,
  files,
  onRemove,
  error,
}: FileUploadZoneProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        {...dropzone.getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
          error
            ? 'border-red-300 bg-red-50 hover:border-red-400'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
      >
        <input {...dropzone.getInputProps()} />
        <Upload className={`mx-auto h-8 w-8 ${error ? 'text-red-400' : 'text-gray-400'}`} />
        <p className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
          Drop files here or click to upload
        </p>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 border border-gray-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="ml-2 text-red-500 hover:text-red-700 shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="mt-2">
          {Array.isArray(error.message) ? (
            <ul className="text-sm text-red-600 space-y-1">
              {error.message.map((msg: string, idx: number) => (
                <li key={idx}>• {msg}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-red-600">{String(error.message)}</p>
          )}
        </div>
      )}
    </div>
  );
}
