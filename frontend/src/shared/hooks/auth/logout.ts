import graphQLClient from "@/shared/lib/graphql-client";
import { LOGOUT } from "@/shared/lib/graphql/auth";

export async function logout() {
    try {
        const data = await graphQLClient.request(
            LOGOUT
        );
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
