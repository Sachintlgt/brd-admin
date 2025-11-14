'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Property, Staff } from '../types/property';

interface PropertiesContextType {
  properties: Property[];
  staff: Staff[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProperty: (id: string, property: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  toggleActive: (id: string) => void;
  toggleFeatured: (id: string) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

// Mock data
const initialProperties: Property[] = [
  {
    id: '1',
    name: 'Luxury Villa',
    description: 'A beautiful luxury villa',
    location: 'Miami, FL',
    amenities: ['Pool', 'Gym'],
    photos: [],
    videos: [],
    oneTimePricing: 1000000,
    phaseWisePricing: [{ phase: 'Phase 1', price: 500000 }],
    purchasedSharesDetails: 'Details here',
    legalDocuments: [],
    assignedStaff: '1',
    maintenanceCharges: 1000,
    appreciationPrice: 1100000,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialStaff: Staff[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

export const PropertiesProvider = ({ children }: { children: ReactNode }) => {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [staff] = useState<Staff[]>(initialStaff);

  const addProperty = (property: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProperties((prev) => [...prev, newProperty]);
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p)),
    );
  };

  const deleteProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleActive = (id: string) => {
    updateProperty(id, { isActive: !properties.find((p) => p.id === id)?.isActive });
  };

  const toggleFeatured = (id: string) => {
    updateProperty(id, { isFeatured: !properties.find((p) => p.id === id)?.isFeatured });
  };

  return (
    <PropertiesContext.Provider
      value={{
        properties,
        staff,
        addProperty,
        updateProperty,
        deleteProperty,
        toggleActive,
        toggleFeatured,
      }}
    >
      {children}
    </PropertiesContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertiesContext);
  if (!context) throw new Error('useProperties must be used within PropertiesProvider');
  return context;
};
