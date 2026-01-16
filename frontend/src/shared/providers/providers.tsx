'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from './AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './SocketProvider';

const Providers = ({ children } : { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, 
      },
    },
  }));

  return (

    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm, // Включаем темную тему
        }}
      >
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </SocketProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ConfigProvider>
    </GoogleOAuthProvider>
  )
}

export default Providers;
