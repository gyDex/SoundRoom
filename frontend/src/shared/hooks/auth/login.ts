import graphQLClient from "@/shared/lib/graphql-client";
import { LOGIN } from "@/shared/lib/graphql/auth";

export async function login(values: {
    email: string;
    password: string;   
}) {
    try {
        const data = await graphQLClient.request(
            LOGIN, 
            { 
                email: values.email, 
                password: values.password,
            }
        );
        return data.login;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
