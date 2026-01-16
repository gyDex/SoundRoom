// shared/hooks/auth/useAuth.ts
'use client';

import { useMe } from '@/shared/hooks/auth/useMe';
import { useQueryClient } from '@tanstack/react-query';

export function useAuth() {
  const { user, loading, error } = useMe();
  const queryClient = useQueryClient();

  const refetchUser = () => {
    return queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  const resetUser = () => {
    queryClient.removeQueries({ queryKey: ['me'] });
  };

  return {
    user,
    loading: loading,
    error,
    isAuthenticated: !!user,
    refetchUser,
    resetUser,
  };
}
