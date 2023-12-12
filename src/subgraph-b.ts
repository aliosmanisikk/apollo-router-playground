import { gql } from 'graphql-tag';
import { run } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.4", import: ["@key", "@interfaceObject"])

  type Media @key(fields: "id", resolvable: false) @interfaceObject {
    id: ID!
  }

  extend type Query {
    medias: [Media!]!
    media(id: String!): Media!
    subscriptions: [Subscription!]!
  }

  type SubscriptionOrder {
    id: String!
    state: String!
  }

  input SubscriptionOrderInput {
    size: Int = 1
  }

  type Subscription {
    id: String
    orders(input: SubscriptionOrderInput! = {}): [SubscriptionOrder!]!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    medias: () => [{ id: '1' }, { id: '2' }, { id: '3' }],
    media: (_: unknown, { id }: { id: string }) => ({
      id,
    }),
    subscriptions: () => [
      {
        id: '1',
        orders: [
          { id: '1', state: 'Shipped' },
          { id: '2', state: 'Pending' },
        ],
      },
      {
        id: '2',
        orders: [
          { id: '1', state: 'Shipped' },
          { id: '2', state: 'Pending' },
        ],
      },
      {
        id: '3',
        orders: [
          { id: '1', state: 'Shipped' },
          { id: '2', state: 'Pending' },
        ],
      },
    ],
  },
  Subscription: {
    orders: (parent: { orders: unknown[] }, { input }: { input: { size: number } }) => {
      return parent.orders.slice(0, input.size);
    },
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, 'SubgraphB');
