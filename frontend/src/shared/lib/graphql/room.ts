import { gql } from "graphql-request";

export const GET_CONNECT_USERS = gql`
    query getConnectedUsers($roomId: ID!) {
        getConnectedUsers(input: {
            roomId: $roomId
        }) {
            hostId
            connectedUsers {
                id
                username
                tag
                userAvatar
                email
                createdAt
            }
        }
    }
`
