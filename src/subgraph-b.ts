import { gql } from 'graphql-tag';
import { run } from './common';

const globalStoreIdEnabled = true;

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.11"
      import: ["@key", "@shareable", "@interfaceObject", "@requiresScopes", "@policy", "@external", "@provides"]
    )

  type Media @key(fields: "id", resolvable: false) @interfaceObject {
    id: ID!
  }

  type Store @key(fields: "code", resolvable: false) @key(fields: "globalStoreId", resolvable: false) {
    code: String! @external
    globalStoreId: String! @external
  }

  type Appointment {
    id: String!
    store: Store! @provides(fields: "code")
    store2: Store! @provides(fields: "globalStoreId")
  }

  extend type Query {
    medias: [Media!]!
    media(id: String!): Media!
    appointment(id: String!): Appointment!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    medias: () => [{ id: '1' }, { id: '2' }, { id: '3' }],
    media: (_: unknown, { id }: { id: string }) => ({ id }),
    appointment: (_: unknown, { id }: { id: string }) => {
      if (id === '1') {
        return { id, store: { code: 'codeReference' }, store2: { globalStoreId: 'globalStoreIdreference' } };
      }
      return { id, store: { globalStoreId: 'globalStoreIdreference' }, store2: { code: 'codeReference' } };
    },
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, 'SubgraphB');
