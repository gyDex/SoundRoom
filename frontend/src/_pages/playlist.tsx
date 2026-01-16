'use client'

import { getPlaylistByID } from "@/shared/hooks/usePlaylistById"
import { PlaylistContent, PlaylistTop } from "@/widgets"
import Loader from "@/widgets/Loader/Loader"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "next/navigation"


export const PlaylistPage = () => {
  const { id } = useParams() as any;

  const { data, isLoading, error } = useQuery({
    queryKey: ['playlistId', id],
    queryFn: () => getPlaylistByID(id),
    enabled: !!id
  });

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading playlist</div>;

  console.log(data)

  return (
    <>
      <PlaylistTop id={id} imageUrl={data?.playlist?.imageUrl ?? ''} name={data?.playlist?.name ?? ''}/>
      <PlaylistContent items={data?.playlist?.tracks ?? []} />
    </>
  )
}