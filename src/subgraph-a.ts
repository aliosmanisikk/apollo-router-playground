import { gql } from "graphql-tag";
import { isDefined, run, withResolver } from "./common";

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.13"
      import: ["@key", "@shareable"]
    )

  type Customer @key(fields: "id") @shareable {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    customer: Customer!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    customer: withResolver(
      async (_: unknown, __: unknown) => ({
        id: "my id",
        name: `Customer my id`,
        email: "customer@example.com",
      }),
      "Query.customer",
    ),
  },
};

export const runA = () => run(typeDefs, resolvers, 3001, "subgraph-a");
