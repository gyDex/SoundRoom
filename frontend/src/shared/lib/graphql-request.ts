import { gql } from 'graphql-request';
import graphQLClient from './graphql-client';

const REFRESH = gql`
  mutation RefreshToken {
    refreshToken
  }
`;

let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

export async function graphqlRequest<T>(
  query: any,
  variables?: any
): Promise<T> {
  try {
    console.log('graphqlRequest')
    return await graphQLClient.request<T>(query, variables);
  } catch (err: any) {
    const error = err?.response?.errors?.[0];
    const code = error?.extensions?.code;

    if (code === 'UNAUTHENTICATED') {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = graphQLClient.request(REFRESH);
      }

      await refreshPromise;
      isRefreshing = false;

      return graphQLClient.request<T>(query, variables);
    }

    throw err;
  }
}
