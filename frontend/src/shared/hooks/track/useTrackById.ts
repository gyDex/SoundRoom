import graphQLClient from "@/shared/lib/graphql-client";
import { GET_TRACK } from "@/shared/lib/graphql/tracks";

export async function getTrackByID(id: string) {
    try {
        const data = await graphQLClient.request(
            GET_TRACK, 
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