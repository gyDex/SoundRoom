import { gql } from 'graphql-request';

export const GET_TRACKS = gql`
  query GetAllTracks {
    tracks {  
      id
      name
      duration
      genre
      urlFile
      created_at
      artist {
        id
        name
        imageUrl
        genre
      }
    }
  }
`;

export const ADD_FAV = gql`
  mutation ADD_FAV($input: AddFavoriteInput!) {
    addFavorite(input: $input)
  }
`

export const CHECK_FAV = gql`
  query checkFavorite($input: AddFavoriteInput!) {
    checkFavorite(input: $input)
  }
`

export const GET_FAV_TRACKS = gql`
  query GetFavTrack {
    getFavorite {
      id
      name
      artist
      duration
      genre
      urlFile
      created_at
    }
  }
`

export const GET_TRACK = gql`
  query GetTrack($id: ID!) {
    track(id: $id) {
      id
      name
      artist {
        id
        name
        imageUrl
        genre
      }
      duration
      genre
      urlFile
      created_at
    }
  }
`;

export const CREATE_TRACK = gql`
  mutation CreateTrack($createTrackInput: CreateTrackInput!) {
    createTrack(createTrackInput: $createTrackInput) {
      id
      name
      artist
      duration
      genre
      urlFile
      created_at
    }
  }
`;

export const UPDATE_TRACK = gql`
  mutation UpdateTrack($updateTrackInput: UpdateTrackInput!) {
    updateTrack(updateTrackInput: $updateTrackInput) {
      id
      name
      artist
      duration
      genre
      urlFile
      createdAt
    }
  }
`;

export const DELETE_TRACK = gql`
  mutation RemoveTrack($id: Int!) {
    removeTrack(id: $id) {
      id
    }
  }
`;