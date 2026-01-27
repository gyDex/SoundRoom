'use client'
import React, { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, theme as antdTheme, theme } from 'antd'
import { AuthProvider } from './AuthProvider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './SocketProvider';
import { ThemeMode, ThemeProvider } from 'antd-style';

const Providers = ({ children } : { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, 
      },
    },
  }));

  const [mode, setMode] = useState<ThemeMode>('dark')

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      {/* <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }} */}
      {/* > */}
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <AuthProvider>
              <ThemeProvider
                themeMode={mode}
                onThemeModeChange={setMode}
              >
                <ConfigProvider
                  theme={{
                    algorithm:
                      mode === 'dark'
                        ? antdTheme.darkAlgorithm
                        : antdTheme.defaultAlgorithm,
                  }}
                >
                  {children}
                </ConfigProvider>
              </ThemeProvider>
            </AuthProvider>
          </SocketProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      {/* </ConfigProvider> */}
    </GoogleOAuthProvider>
  )
}

export default Providers;
