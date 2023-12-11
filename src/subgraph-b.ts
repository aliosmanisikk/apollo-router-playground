import { gql } from "graphql-tag";
import { run } from "./common";

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(
      url: "https://specs.apollo.dev/federation/v2.4"
      import: ["@key", "@interfaceObject"]
    )

  type IMedia @key(fields: "id", resolvable: false) @interfaceObject {
    id: ID!
  }

  extend type Query {
    medias: [IMedia!]!
    media(id: String!): IMedia!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    medias: () => [
      {
        id: "1",
      },
      {
        id: "2",
      },
      {
        id: "3",
      },
    ],
    media: (_: unknown, { id }: { id: string }) => ({
      id,
    }),
  },
};

export const runB = async () => {
  const { url } = await run(typeDefs, resolvers, 3002);
  console.log(`🚀 SubgraphB ready at ${url}`);
};