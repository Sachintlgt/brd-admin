// src/components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    // 👇 Same wrapper structure as server-rendered layout to prevent hydration mismatch
    return <div className="min-h-screen bg-gray-50" />;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
