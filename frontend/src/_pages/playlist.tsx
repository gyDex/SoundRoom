'use client'

import graphQLClient from "@/shared/lib/graphql-client"
import { GET_PLAYLIST_BY_ID } from "@/shared/lib/graphql/playlist"
import { PlaylistContent, PlaylistTop } from "@/widgets"
import Loader from "@/widgets/Loader/Loader"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"


export const PlaylistPage = () => {
  const { id } = useParams() as any;

  function usePlaylist() {
      return useQuery({
        queryKey: ['playlistId'],
        queryFn: async (): Promise<any> => {
          try {
            const data = await graphQLClient.request(GET_PLAYLIST_BY_ID, {
              id: id
            });
            return data;
          } catch (error) {
            console.error('❌ GraphQL error:', error); 
            throw error;
          }
        },
        retry: 1, 
      });
  }

  const { data, isLoading, error } = usePlaylist();

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading playlist</div>;

  return (
    <>
      <PlaylistTop tracks={data?.playlist?.tracks ?? []}  id={id} imageUrl={data?.playlist?.imageUrl ?? ''} name={data?.playlist?.name ?? ''}/>
      <PlaylistContent items={data?.playlist?.tracks ?? []} />
    </>
  )
}