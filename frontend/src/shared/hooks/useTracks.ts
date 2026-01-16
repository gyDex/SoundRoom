import { useQuery } from "@tanstack/react-query";
import graphQLClient from "../lib/graphql-client";
import { GET_TRACKS } from "../lib/graphql/tracks";
import { Playlist } from "./usePlaylistUser";

export interface Track {
  id: string;
  name: string;
  artist: string;
  duration: number;
  genre: string;
  urlFile: string;
  playlist?: Playlist[]
}
export function useTracks() {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: async (): Promise<Track[]> => {
      console.log('🔄 useTracks queryFn started'); // ← Добавьте этот лог
      
      try {
        const data = await graphQLClient.request(GET_TRACKS);
        console.log('✅ GraphQL response:', data); // ← Этот должен сработать
        return data.tracks;
      } catch (error) {
        console.error('❌ GraphQL error:', error); // ← Лог ошибки
        throw error;
      }
    },
    retry: 1, // ← Добавьте retry для тестирования
  });
}