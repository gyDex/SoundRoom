import { GraphQLClient } from 'graphql-request';

const graphQLClient = new GraphQLClient('http://localhost:4000/graphql', {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    // errorPolicy: 'all',
});

export default graphQLClient;