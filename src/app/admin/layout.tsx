"use client"

import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until loading is finished

    // If the user is not an admin (which includes not being logged in),
    // redirect them to the homepage.
    if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  // While loading or if the user is not an admin, show a loader.
  // The useEffect above will handle the redirect.
  if (loading || !isAdmin) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render children if user is an authenticated admin
  return <>{children}</>;
}
