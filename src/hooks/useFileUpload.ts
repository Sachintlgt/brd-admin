import { useDropzone } from 'react-dropzone';

const IMAGE_MAX = 20;
const VIDEO_MAX = 5;
const DOC_MAX = 10;

export const useFileUpload = (props: any) => {
  const {
    setValue,
    getValues,
    imageFiles,
    setImageFiles,
    videoFiles,
    setVideoFiles,
    documentFiles,
    setDocumentFiles,
    iconFiles,
    setIconFiles,
  } = props;

  const onImagesDrop = (accepted: File[]) => {
    const allowed = Math.max(0, IMAGE_MAX - imageFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...imageFiles, ...toAdd];
    setImageFiles(next);
    setValue('propertyImages', [...getValues('propertyImages'), ...toAdd.map((f) => f.name)]);
  };

  const onVideosDrop = (accepted: File[]) => {
    const allowed = Math.max(0, VIDEO_MAX - videoFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...videoFiles, ...toAdd];
    setVideoFiles(next);
    setValue('propertyVideos', [
      ...(getValues('propertyVideos') || []),
      ...toAdd.map((f) => f.name),
    ]);
  };

  const onDocumentsDrop = (accepted: File[]) => {
    const allowed = Math.max(0, DOC_MAX - documentFiles.length);
    const toAdd = accepted.slice(0, allowed);
    if (toAdd.length === 0) return;
    const next = [...documentFiles, ...toAdd];
    setDocumentFiles(next);
    setValue('documents', [...(getValues('documents') || []), ...toAdd.map((f) => f.name)]);
  };

  const onIconsDrop = (accepted: File[]) => {
    const next = [...iconFiles, ...accepted];
    setIconFiles(next);
    setValue('amenityIcons', [
      ...(getValues('amenityIcons') || []),
      ...accepted.map((f) => f.name),
    ]);
  };

  const imageDropzone = useDropzone({
    onDrop: onImagesDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const videoDropzone = useDropzone({
    onDrop: onVideosDrop,
    accept: { 'video/*': [] },
    multiple: true,
  });

  const documentDropzone = useDropzone({
    onDrop: onDocumentsDrop,
    accept: { 'application/*': [] },
    multiple: true,
  });

  const iconDropzone = useDropzone({
    onDrop: onIconsDrop,
    accept: { 'image/*': [] },
    multiple: true,
  });

  const removeFile = (idx: number, type: 'image' | 'video' | 'document' | 'icon') => {
    switch (type) {
      case 'image':
        setImageFiles(imageFiles.filter((_: File, i: number) => i !== idx));
        setValue(
          'propertyImages',
          getValues('propertyImages').filter((_: string, i: number) => i !== idx),
        );
        break;
      case 'video':
        setVideoFiles(videoFiles.filter((_: File, i: number) => i !== idx));
        setValue(
          'propertyVideos',
          (getValues('propertyVideos') || []).filter((_: string, i: number) => i !== idx),
        );
        break;
      case 'document':
        setDocumentFiles(documentFiles.filter((_: File, i: number) => i !== idx));
        setValue(
          'documents',
          (getValues('documents') || []).filter((_: string, i: number) => i !== idx),
        );
        break;
      case 'icon':
        setIconFiles(iconFiles.filter((_: File, i: number) => i !== idx));
        setValue(
          'amenityIcons',
          (getValues('amenityIcons') || []).filter((_: string, i: number) => i !== idx),
        );
        break;
    }
  };

  return {
    imageDropzone,
    videoDropzone,
    documentDropzone,
    iconDropzone,
    removeFile,
  };
};
