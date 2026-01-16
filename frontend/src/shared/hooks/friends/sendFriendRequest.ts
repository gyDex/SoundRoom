import graphQLClient from "@/shared/lib/graphql-client";
import { SEND_FRIEND_REQ } from "@/shared/lib/graphql/friends";

export async function sendFriendRequest(values: {
    tag: string;   
}) {
    try {
        const data = await graphQLClient.request(
            SEND_FRIEND_REQ, 
            { 
               tag: values.tag
            }
        );
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}