import { useQuery } from '@tanstack/react-query';
import { GETME } from '@/shared/lib/graphql/auth';
import { graphqlRequest } from '@/shared/lib/graphql-request';

export function useMe() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['me'],
    queryFn: () => graphqlRequest(GETME) as any,
    retry: false,
  });

  return {
    user: data?.getMe ?? null,
    loading: isLoading,
    error: isError,
  };
}
