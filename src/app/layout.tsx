// app/layout.tsx
import React, { Suspense } from 'react';
import './globals.css';
import Providers from '@/app/providers/providers';
import FullScreenLoader from '@/components/FullScreenLoader';

export const metadata = {
  title: 'My App',
  description: '...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<FullScreenLoader />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
