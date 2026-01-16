import graphQLClient from "@/shared/lib/graphql-client";
import { SIGNUP } from "@/shared/lib/graphql/auth";

export async function signup(values: {
    email: string;
    password: string;   
    username: string;   
}) {
    try {
        const data = await graphQLClient.request(
            SIGNUP, 
            { 
                email: values.email, 
                password: values.password,
                username: values.username,
            }
        );
        return data.login;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
