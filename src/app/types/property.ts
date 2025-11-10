export interface Property {
  id: string;
  name: string;
  description: string;
  location: string;
  amenities: string[];
  photos: string[]; // URLs or file names
  videos: string[]; // URLs or file names
  oneTimePricing: number;
  phaseWisePricing: { phase: string; price: number }[];
  purchasedSharesDetails: string;
  legalDocuments: string[]; // file names
  assignedStaff: string; // staff id or name
  maintenanceCharges: number;
  appreciationPrice: number;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Staff {
  id: string;
  name: string;
}