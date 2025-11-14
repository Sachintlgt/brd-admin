import { PropertyFormValues } from '../validations/property.validation';

export const mapFormToProperty = (values: PropertyFormValues) => {
  const amenityNames = (values.amenityNames ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const amenities = amenityNames.map((name, i) => ({
    name,
    icon: (values.amenityIcons && values.amenityIcons[i]) || null,
  }));

  const photos = values.propertyImages || [];
  const videos = values.propertyVideos || [];
  const docs = values.documents || [];

  return {
    name: values.name,
    location: values.location,
    description: values.description,
    totalShares: values.totalShares,
    availableShares: values.availableShares,
    pricePerShare: values.pricePerShare,
    appreciationRate: values.appreciationRate ?? 0,
    maxBookingDays: values.maxBookingDays ?? 0,
    isActive: values.isActive,
    isFeatured: values.isFeatured,
    amenities,
    photos,
    videos,
    documents: docs,
  };
};
