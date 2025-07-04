
'use client';

import { useAuth } from '@/hooks/use-auth';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// Define paths that are publicly accessible to unauthenticated users.
const PUBLIC_PATHS = ['/', '/login'];

export function AuthProtector({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Determine if the current path needs protection.
  // The `/admin` routes have their own layout-based protection, so we exclude them here.
  const isProtectedPath = !PUBLIC_PATHS.includes(pathname) && !pathname.startsWith('/admin');

  useEffect(() => {
    // Wait until authentication status is resolved.
    if (loading) {
      return;
    }

    // If the path is protected and there's no user, redirect to login.
    if (isProtectedPath && !user) {
      router.push('/login');
    }
  }, [user, loading, router, isProtectedPath, pathname]);

  // While loading auth state on a protected page, show a loader.
  if (loading && isProtectedPath) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If on a protected route and not logged in, show a loader during redirect.
  if (isProtectedPath && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Otherwise, render the children.
  return <>{children}</>;
}
