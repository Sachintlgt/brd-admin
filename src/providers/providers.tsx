'use client';

import { QueryProvider } from '@/providers/query-provider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <Toaster position="top-right" />
      {children}
    </QueryProvider>
  );
}
