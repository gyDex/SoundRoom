'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import graphQLClient from '@/shared/lib/graphql-client';
import { gql } from 'graphql-request';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($token: String!) {
    googleLogin(googleLoginInput: { token: $token }) {
      tokenType
      accessToken
    }
  }
`;

export function GoogleLoginButton() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (token: string) =>
      graphQLClient.request(GOOGLE_LOGIN, { token }),
    onSuccess: async (data) => {
      console.log('Google login success:', data);
      
      // Сохраняем токен в localStorage
      if (data.googleLogin?.accessToken) {
        localStorage.setItem('access_token', data.googleLogin.accessToken);
        
        // Сохраняем данные пользователя
        if (data.googleLogin.user) {
          localStorage.setItem('user', JSON.stringify(data.googleLogin.user));
        }
      }
      
      // Обновляем состояние
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      await queryClient.refetchQueries({ queryKey: ['me'] });
      
      // Редирект
      router.push('/');
    },
    onError: (error: any) => {
      console.error('Google login error:', error);
      setError(
        error.response?.errors?.[0]?.message || 
        'Ошибка при входе через Google'
      );
      
      // Автоматически очищаем ошибку через 5 секунд
      setTimeout(() => setError(null), 5000);
    },
  });

  return (
    <div style={{ position: 'relative' }}>
      <GoogleLogin
        onSuccess={async (cred) => {
          if (!cred.credential) {
            setError('Не удалось получить данные от Google');
            return;
          }

          setError(null);
          await mutateAsync(cred.credential);
        }}
        onError={() => {
          console.error('Google OAuth error');
          setError('Ошибка авторизации Google');
        }}
        theme="filled_blue"
        size="large"
        shape="rectangular"
        text="continue_with"
      />
      
      {isPending && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}>
          <div>Загрузка...</div>
        </div>
      )}
      
      {error && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}
    </div>
  );
}