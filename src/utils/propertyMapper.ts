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
  const certificateImages = values.certificateImages || [];
  const floorPlanImages = values.floorPlanImages || [];

  return {
    name: values.name,
    location: values.location,
    description: values.description,
    beds: values.beds,
    bathrooms: values.bathrooms,
    sqft: values.sqft,
    maxOccupancy: values.maxOccupancy,
    totalShares: values.totalShares,
    availableShares: values.availableShares,
    initialPricePerShare: values.initialPricePerShare,
    currentPricePerShare: values.currentPricePerShare,
    wholeUnitPrice: values.wholeUnitPrice,
    targetIRR: values.targetIRR,
    targetRentalYield: values.targetRentalYield,
    appreciationRate: values.appreciationRate ?? 0,
    possessionDate: values.possessionDate,
    launchDate: values.launchDate,
    maxBookingDays: values.maxBookingDays ?? 0,
    bookingAmount: values.bookingAmount,
    bookingAmountGST: values.bookingAmountGST,
    isActive: values.isActive,
    isFeatured: values.isFeatured,
    amenityNames: values.amenityNames,
    documentNames: values.documentNames,
    amenities,
    photos,
    videos,
    documents: docs,
    certificateImages,
    floorPlanImages,
    pricingDetails: values.pricingDetails,
    shareDetails: values.shareDetails,
    maintenanceTemplates: values.maintenanceTemplates,
    highlights: values.highlights,
    certificates: values.certificates,
    floorPlans: values.floorPlans,
    paymentPlans: values.paymentPlans,
  };
};
