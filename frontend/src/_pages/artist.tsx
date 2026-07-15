'use client'

import graphQLClient from "@/shared/lib/graphql-client";
import { GET_ARTIST_BY_ID } from "@/shared/lib/graphql/artist";
import { ErrorState } from "@/widgets";
import ArtistContent from "@/widgets/Artist/ArtistContent/ArtistContent";
import ArtistTop from "@/widgets/Artist/ArtistTop/ArtistTop";
import Loader from "@/widgets/Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

export const ArtistPage = () => {
    const { id } = useParams() as any;

    function useArtist() {
        return useQuery({
            queryKey: ['artistId'],
            queryFn: async (): Promise<any> => {
                try {
                    const data = await graphQLClient.request(GET_ARTIST_BY_ID, {
                        id: id
                    });
                    return data.artist;
                } 
                catch (error) {
                    console.error('❌ GraphQL error:', error); 
                    throw error;
                }
            },
            retry: 1, 
        });
    }

    
    const { data, isLoading, error } = useArtist();
    console.log(data)
    
    if (isLoading) return <Loader />;
    if (error) return <ErrorState text="Ошибка загрузки страницы" />;
        
    return (
        <>
            <ArtistTop id={data.id} imageUrl={data.imageUrl} name={data.name} tracks={data.tracks} />
            <ArtistContent items={data.tracks} />
        </>
    )
}