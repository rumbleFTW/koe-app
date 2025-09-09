'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useSWRFetcher } from '@/lib/hooks/useswr';

interface UserContextType {
  user: unknown | null;
  loading: boolean;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const customerId = useMemo(() => {
    return session?.user?.id ? String(session.user.id) : null;
  }, [session]);

  const swrKey = customerId ? `/v1/profile/customer/${customerId}` : null;
  const {
    response: profile,
    loading,
    error,
  } = useSWRFetcher<unknown>(swrKey);

  const contextValue = useMemo(
    () => ({
      user: profile || null,
      loading: status === 'loading' || loading,
      error,
    }),
    [profile, loading, error, status],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
