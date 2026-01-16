
import graphQLClient from '@/shared/lib/graphql-client';
import { useMutation } from '@tanstack/react-query';
import { gql } from 'graphql-request';

const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($token: String!) {
    googleLogin(googleLoginInput: { token: $token }) {
      tokenType
      accessToken
    }
  }
`;

export function useGoogleLogin() {
  return useMutation({
    mutationFn: (token: string) =>
      graphQLClient.request(GOOGLE_LOGIN, { token }),
  });
}
