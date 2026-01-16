import { gql } from "graphql-request";

export const GET_PLAYLISTS = gql`
  query GetAllPlaylist {
    playlists {  
        id
        name
        imageUrl
        updatedAt
        createdAt
    }
    }
`;

export const DELETE_PLAYLIST = gql`
  mutation deletePlaylist($playlistId: ID!) {
    deletePlaylist(
      deletePlaylistInput: {
        playlistId: $playlistId
      }
    ) {
      id
      name
    }
  }
`;

// export const GET_PLAYLISTS_BY_USERID = gql`
//   query GetAllPlaylist($userId: ID!) {
//       playlists(userId: $userId)  {  
//           id
//           name
//           imageUrl
//           updatedAt
//           createdAt
//       }
//     }
// `;

export const GET_PLAYLISTS_BY_USERID = gql`
  query GetPlaylistByUserId($userId: ID!) {
      playlistsByUser(userId: $userId) {  
        id
        name
        imageUrl 
        trackIds
        createdAt
        updatedAt
      }
    }
`;

export const GET_PLAYLIST_BY_ID = gql`
  query GetPlaylistById($id: ID!) {
    playlist(id: $id) {  
      id
      name
      imageUrl 
      trackIds
      createdAt
      updatedAt
      tracks {
        id
        name
        artist
        duration
        urlFile
        created_at
      }
    }
  }
`;

export const GET_USER_PLAYLISTS = gql`
  query GetUserPlaylists($userId: ID!) {
    playlistsByUser(userId: $userId) {
      id
      name
      imageUrl
      createdAt
      updatedAt
      tracks {
        id
        name
        artist
      }
    }
  }
`;



export const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist(
    $userId: ID!
    $name: String!
    $imageUrl: String
    $trackIds: [ID!]
  ) {
    createPlaylist(createPlaylistInput: {
      userId: $userId
      name: $name
      imageUrl: $imageUrl
      trackIds: $trackIds
    }) {
      id
      name
      userId
      imageUrl 
      trackIds
      createdAt
      updatedAt
    }
  }
`;