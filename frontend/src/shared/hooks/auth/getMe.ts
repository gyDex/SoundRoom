// shared/api/auth/getMe.ts
import graphQLClient from '@/shared/lib/graphql-client';
import { GETME } from '@/shared/lib/graphql/auth';

export async function getMe() {
  const data = await graphQLClient.request(GETME);
  return data.getMe;
}
