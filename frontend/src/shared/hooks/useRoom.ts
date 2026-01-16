import { useQuery } from "@tanstack/react-query";
import graphQLClient from "../lib/graphql-client";
import { GET_CONNECT_USERS } from "../lib/graphql/room";
import { roomStore } from "../stores/room.store";

export function useRoomUsers(roomId?: string) {
    return useQuery({
        queryKey: ['connected-users', roomId],
        queryFn: async () => {
            if (!roomId) return [];
            const data = await graphQLClient.request(GET_CONNECT_USERS, { roomId });
            return data.getConnectedUsers;
        },
        enabled: !!roomId, // Запрос выполнится только если есть roomId
        retry: 1,
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        staleTime: 5000,
        gcTime: 5 * 60 * 1000,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
    });
}

