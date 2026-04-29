import { gql } from "graphql-tag";
import { run, withResolver } from "./common";

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.13"
      import: ["@key", "@shareable", "@external", "@requires"]
    )

  type Customer @key(fields: "id") @shareable {
    id: ID!
    valid: Boolean!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Customer: {
    valid: withResolver(
      async ({ id }: { id: string }) => id.endsWith("@example.com"),
      "Customer.valid",
    ),
  },
};

export const runC = () => run(typeDefs, resolvers, 3003, "subgraph-c");
