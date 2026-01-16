import { useQuery } from "@tanstack/react-query";
import graphQLClient from "../lib/graphql-client";
import { GET_FRIENDS } from "../lib/graphql/friends";

export function useFriends() {
  return useQuery({
    queryKey: ['friends'],
    queryFn: async (): Promise<any> => {
      try {
        const data = await graphQLClient.request(GET_FRIENDS);
        return data.getAllFriends;
      } catch (error) {
        console.error('❌ GraphQL error:', error); 
        throw error;
      }
    },
    retry: 1, 
  });
}