import { gql } from "graphql-request";

export const LOGIN = gql`
    mutation Login($email: String!, $password: String!) {
        login(loginInput: {
            email: $email
            password: $password
        }) {
            accessToken
            refreshToken
            expiresIn
            tokenType
        }
    }
`

export const SIGNUP = gql`
    mutation Register($email: String!, $password: String!, $username: String!) {
        register(registerInput: {
            email: $email
            password: $password
            username: $username
            userAvatar: ""
        }) {
            accessToken
            refreshToken
            expiresIn
            tokenType
        }
    }
`

export const GETME = gql`
    query GetMe {
        getMe {
            id
            email
            username
            createdAt
            updatedAt
            tag
            playlists {
                id
                name
                createdAt
            }
        }
    }
`

export const LOGOUT = gql`
    mutation Logout {
        logout {
            success 
        }
    }
`