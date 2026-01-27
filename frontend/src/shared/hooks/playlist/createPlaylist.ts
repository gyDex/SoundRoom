import graphQLClient from "@/shared/lib/graphql-client";
import { CREATE_PLAYLIST } from "@/shared/lib/graphql/playlist";

export async function createPlaylist(values: {
    userId: string,
    name: string;
    imageUrl: string;
    tracks: any[];    
}) {
    try {

        const data = await graphQLClient.request(
            CREATE_PLAYLIST, 
            { 
                userId: values.userId,
                name: values.name, 
                imageUrl: values.imageUrl,
                trackIds: values.tracks
            }
        );


        return data.createPlaylist;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

// export async function getByIdPlaylist(id: string) {
//     try {
//         const data = await graphQLClient.request(
//             GET_PLAYLIST, 
//             {
//                 id: id
//             }
//         );
//         return data;
//     } catch (error) {
//         console.error('Error:', error);
//         throw error;
//     }
// }