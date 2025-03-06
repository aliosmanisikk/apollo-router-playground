import { gql } from 'graphql-tag';
import { run } from './common';

const globalStoreIdEnabled = true;

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.10", import: ["@key", "@shareable", "@interfaceObject"])

  type Media @key(fields: "id") @interfaceObject {
    id: ID!
    extraField: String!
  }

  ${globalStoreIdEnabled
    ? `
  type Store @key(fields: "globalStoreId", resolvable: false) {
    globalStoreId: String!
  }`
    : `  
  type Store @key(fields: "code", resolvable: false) {
    code: String!
  }`}

  type NewAppointment {
    id: String!
    store: Store!
  }

  extend type Query {
    newAppointment(id: String!): NewAppointment!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Media: { extraField: () => 'Extra Field' },
  Query: {
    newAppointment: (_: unknown, { id }: { id: string }) => {
      return { id, store: globalStoreIdEnabled ? { globalStoreId: 'globalStoreIdReference' } : { code: 'codeReference' } };
    },
  },
};

export const runC = () => run(typeDefs, resolvers, 3003, 'SubgraphC');
