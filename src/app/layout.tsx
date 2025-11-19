// app/layout.tsx
import React, { Suspense } from 'react';
import './globals.css';
import FullScreenLoader from '@/components/FullScreenLoader';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { PropertiesProvider } from './context/PropertiesContext';

export const metadata = {
  title: 'BRD Associates',
  description: '...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <Suspense fallback={<FullScreenLoader />}>
          <AuthProvider>
            <PropertiesProvider>{children}</PropertiesProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
