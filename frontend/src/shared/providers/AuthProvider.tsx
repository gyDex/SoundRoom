'use client';

import { useEffect } from 'react';
import { useAuth } from '../lib/graphql/useAuth';
import { usePathname, useRouter } from 'next/navigation';

const AUTH_ROUTES = ['/login', '/sign-up'];
const PROTECTED_ROUTES = ['/'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; 

    const isAuthRoute = AUTH_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    const isProtectedRoute = PROTECTED_ROUTES.some(route =>
      pathname.startsWith(route)
    );

    if (isProtectedRoute && !isAuthenticated && !isAuthRoute) {
      router.replace('/login'); 
      return;
    }

    if (isAuthRoute && isAuthenticated) {
      router.replace('/');
    }
  }, [pathname, isAuthenticated, loading]);

  return children;
}
