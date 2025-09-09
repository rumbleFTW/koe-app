'use client';

import { UserProvider } from '@/lib/hooks/useUser';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <Toaster />
        {children}
      </UserProvider>
    </SessionProvider>
  );
}
