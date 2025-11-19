// app/layout.tsx
import React, { Suspense } from 'react';
import './globals.css';
import Providers from '@/app/providers/providers';
import FullScreenLoader from '@/components/FullScreenLoader';
import { Toaster } from 'react-hot-toast';
// import { LoadScript } from '@react-google-maps/api';
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
          <Providers>
            {' '}
            {/* <LoadScript
                  googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                  libraries={['places']}
                > */}
            {children}
            {/* </LoadScript> */}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
