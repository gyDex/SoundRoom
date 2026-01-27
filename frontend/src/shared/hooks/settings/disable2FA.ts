import graphQLClient from "@/shared/lib/graphql-client";
import { DISABLE_2FA } from "@/shared/lib/graphql/settings";

export async function disable2FA(code: string) {
    try {
        const data = await graphQLClient.request(
            DISABLE_2FA, 
            { code }
        );
        return data.enable;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}