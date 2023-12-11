import { gql } from "graphql-tag";
import { run } from "./common";

// The GraphQL schema
const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.4", import: ["@key"])

  interface IMedia @key(fields: "id") {
    id: ID!
    title: String!
  }

  type Book implements IMedia @key(fields: "id") {
    id: ID!
    title: String!
    numberOfPages: Int!
  }

  type Album implements IMedia @key(fields: "id") {
    id: ID!
    title: String!
    numberOfSongs: Int!
  }

  type Magazine implements IMedia @key(fields: "id") {
    id: ID!
    title: String!
    numberOfSections: Int!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  IMedia: {
    __resolveReference: async ({ id }: { id: string }) => {
      if (id === "1") {
        return {
          __typename: "Book",
          id,
          title: "Lord of the rings",
          numberOfPages: 555,
        };
      } else if (id === "2") {
        return {
          __typename: "Album",
          id,
          title: "Thriller",
          numberOfSongs: 9,
        };
      }

      return {
        __typename: "Magazine",
        id,
        title: "Ok",
        numberOfSections: 5,
      };
    },
  },
};

export const runA = async () => {
  const { url } = await run(typeDefs, resolvers, 3001);
  console.log(`🚀 SubgraphA ready at ${url}`);
};
