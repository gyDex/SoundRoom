import graphQLClient from "@/shared/lib/graphql-client";
import { APPLY_FRIEND_REQ, REJECT_FRIEND_REQ } from "@/shared/lib/graphql/friends";

export async function rejectFriendRequest(values: {
    id: string;   
}) {
    try {
        const data = await graphQLClient.request(
            REJECT_FRIEND_REQ, 
            { 
               id: values.id
            }
        );
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}