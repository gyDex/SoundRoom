import graphQLClient from "@/shared/lib/graphql-client";
import { CHECK_FAV } from "@/shared/lib/graphql/tracks";

export async function checkFavorite({trackId}: {
    trackId: string,    
}) {
    try {

        const data = await graphQLClient.request(
            CHECK_FAV, 
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
