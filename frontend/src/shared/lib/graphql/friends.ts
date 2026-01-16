import { gql } from "graphql-request";

export const SEND_FRIEND_REQ = gql`
    mutation sendFriendRequest($tag: String!) {
        sendFriendRequest(input: {
            tag: $tag
        })
    }
`

export const REJECT_FRIEND_REQ = gql`
    mutation rejectRequest($id: String!) {
        rejectRequest(input: {
            id: $id
        })
    }
`

export const APPLY_FRIEND_REQ = gql`
    mutation applyRequest($id: String!) {
        applyRequest(input: {
            id: $id
        })
    }
`

export const GET_FRIEND_REQ = gql`
    query getIncomingFriendRequests {
        getIncomingFriendRequests {
            id
            requester {
                id
                username
                tag
            }
        }
    }
`

export const GET_FRIENDS = gql`
    query getAllFriends {
        getAllFriends {
            id
            username
            tag
        }
    }
`
