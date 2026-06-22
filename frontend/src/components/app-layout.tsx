'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { IconRailNav } from '@/components/icon-rail-nav';
import { LoadingSpinner } from '@/components/states';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.push('/login');
    }
  }, [loading, token, router]);

  if (loading) return <LoadingSpinner className="h-screen" />;
  if (!token) return null;

  return (
    <div className="min-h-screen bg-background">
      <IconRailNav />
      <main className="min-h-screen pl-16 lg:pl-20">
        <div className="mx-auto max-w-6xl p-6 lg:p-10">{children}</div>
      </main>
    </div>
  );
}
