import { gql } from 'graphql-tag';
import { run } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.4", import: ["@key", "@interfaceObject"])

  type Media @key(fields: "id", resolvable: false) @interfaceObject {
    id: ID!
  }

  extend type Query {
    myMedias: [Media!]!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    myMedias: () => [{ id: '1' }, { id: '2' }, { id: '3' }],
  },
};

export const runC = async () => {
  const { url } = await run(typeDefs, resolvers, 3003);
  console.log(`🚀 SubgraphC ready at ${url}`);
};
