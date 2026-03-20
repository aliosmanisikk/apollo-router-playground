import { gql } from "graphql-tag";
import { run, withResolver } from "./common";

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.12"
      import: ["@key", "@shareable", "@interfaceObject", "@override"]
    )

  type Media @key(fields: "id") @interfaceObject {
    id: ID!
    extraField: String!
  }

  type Customer @key(fields: "id") @shareable {
    id: ID!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Media: {
    extraField: withResolver(async () => "Extra Field", "Media.extraField"),
  },
  Customer: {
    email: withResolver(async ({ id }: { id: string }) => {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate async operation
      return `customer${id}@example.com`;
    }, "Customer.email"),
  },
};

export const runC = () => run(typeDefs, resolvers, 3003, "subgraph-c");
