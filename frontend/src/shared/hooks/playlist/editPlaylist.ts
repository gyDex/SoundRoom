import graphQLClient from "@/shared/lib/graphql-client";
import { EDIT_PLAYLIST } from "@/shared/lib/graphql/playlist";

export type EditProps = {
    id: string,
    userId: string,
    name: string;
    imageUrl: string;
    tracks: any[]; 
}

export async function editPlaylist(values: EditProps | null) {
    try {
        const data = await graphQLClient.request(
            EDIT_PLAYLIST, 
            { 
                id: values?.id,
                userId: values?.userId,
                name: values?.name, 
                imageUrl: values?.imageUrl,
                trackIds: values?.tracks
            }
        );
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
