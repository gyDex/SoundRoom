import { useQuery } from "@tanstack/react-query";
import graphQLClient from "../lib/graphql-client";
import { GET_FRIEND_REQ } from "../lib/graphql/friends";

export function useFriendRequests() {
  return useQuery({
    queryKey: ['friend-request'],
    queryFn: async (): Promise<any> => {
      try {
        const data = await graphQLClient.request(GET_FRIEND_REQ);
        return data.getIncomingFriendRequests;
      } catch (error) {
        console.error('❌ GraphQL error:', error); 
        throw error;
      }
    },
    retry: 1, 
  });
}