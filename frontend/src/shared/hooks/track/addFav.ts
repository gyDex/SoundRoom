import graphQLClient from "@/shared/lib/graphql-client";
import { ADD_FAV } from "@/shared/lib/graphql/tracks";

export async function addFav({trackId}: {
    trackId: string,    
}) {
    try {

        const data = await graphQLClient.request(
            ADD_FAV, 
            { 
                input: {
                    trackId: trackId,
                },
            }
        );


        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
