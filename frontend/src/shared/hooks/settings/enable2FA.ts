import graphQLClient from "@/shared/lib/graphql-client";
import { ENABLE_2FA } from "@/shared/lib/graphql/settings";

export async function enable2FA() {
    try {
        const data = await graphQLClient.request(
            ENABLE_2FA, 
        );
        return data.enableTwoFactor;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}