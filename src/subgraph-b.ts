import { gql } from 'graphql-tag';
import { run, withResolver } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.12"
      import: ["@key", "@shareable", "@interfaceObject", "@requiresScopes", "@policy", "@external", "@provides"]
    )

  type Media @key(fields: "id", resolvable: false) @interfaceObject {
    id: ID!
  }

  extend type Query {
    medias: [Media!]!
    media(id: String!): Media!
  }

  type Customer @key(fields: "email") @shareable {
    email: String
    title: String
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    medias: withResolver(async () => [{ id: '1' }, { id: '2' }, { id: '3' }], 'Query.medias'),
    media: withResolver(async (_: unknown, { id }: { id: string }) => ({ id }), 'Query.media'),
  },
  Customer: {
    title: withResolver(async ({ email }: { email: string }) => `Customer with email ${email}`, 'Customer.title'),
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, 'subgraph-b');
