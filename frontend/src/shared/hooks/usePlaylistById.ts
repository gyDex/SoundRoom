import graphQLClient from "../lib/graphql-client";
import { GET_PLAYLIST_BY_ID, GET_PLAYLISTS_BY_USERID } from "../lib/graphql/playlist";


export async function getPlaylistByUserID(userId: string) {
    try {
        const data = await graphQLClient.request(
            GET_PLAYLISTS_BY_USERID, 
            { 
                userId: userId, 
            }
        );
        console.log(data)
        return data.playlistsByUser;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

export async function getPlaylistByID(id: string) {
    try {
        const data = await graphQLClient.request(
            GET_PLAYLIST_BY_ID, 
            { 
                id: id, 
            }
        );
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}