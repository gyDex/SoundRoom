import { gql } from "graphql-request";

export const GET_ARTIST_BY_ID = gql`
  query GetArtistById($id: ID!) {
    artist(id: $id) {
      id
      name
      genre
      imageUrl
      tracks {
        id
        name
        duration
        genre
        urlFile
        created_at
      }
    }
  }
`;
