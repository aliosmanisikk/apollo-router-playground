import { gql } from "graphql-tag";
import { run, withResolver } from "./common";

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.13"
      import: ["@key", "@shareable"]
    )

  type Profile @shareable {
    title: String!
  }

  type Customer @key(fields: "email") @shareable {
    email: String!
    profile: Profile!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Customer: {
    profile: withResolver(
      async ({ email }: { email: string }) => ({
        title: `Customer with email ${email}`,
      }),
      "Customer.profile",
    ),
  },
};

export const runB = () => run(typeDefs, resolvers, 3002, "subgraph-b");
