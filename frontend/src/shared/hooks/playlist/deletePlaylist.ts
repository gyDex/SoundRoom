import graphQLClient from "@/shared/lib/graphql-client";
import { DELETE_PLAYLIST } from "@/shared/lib/graphql/playlist";

export async function deletePlaylist(values: {
    playlistId: string,
}) {
    try {
        const data = await graphQLClient.request(
            DELETE_PLAYLIST, 
            { 
                playlistId: values.playlistId,
            }
        );
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
