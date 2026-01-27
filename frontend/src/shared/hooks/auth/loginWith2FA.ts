import graphQLClient from "@/shared/lib/graphql-client";
import { LOGIN_WITH_2FA } from "@/shared/lib/graphql/auth";

export async function loginWith2FA(values: {
    email: string;
    code: string;   
    twoFaToken: string,
}) {
    try {
        const data = await graphQLClient.request(
            LOGIN_WITH_2FA, 
            { 
                code: values.code,
                twoFaToken: values.twoFaToken,
            }
        );
        return data.loginWithTwoFactor;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
