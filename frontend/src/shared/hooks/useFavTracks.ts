import { useQuery } from "@tanstack/react-query";
import graphQLClient from "../lib/graphql-client";
import { GET_FAV_TRACKS } from "../lib/graphql/tracks";
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
export function useFavTracks() {
  return useQuery({
    queryKey: ['favorite'],
    queryFn: async (): Promise<any> => {
      console.log('🔄 useTracks queryFn started'); 
      
      try {
        const data = await graphQLClient.request(GET_FAV_TRACKS);
        console.log('✅ GraphQL response:', data); 
        return data.getFavorite;
      } catch (error) {
        console.error('❌ GraphQL error:', error); 
        throw error;
      }
    },
    retry: 1, 
  });
}