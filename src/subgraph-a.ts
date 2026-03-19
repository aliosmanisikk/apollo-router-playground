import { gql } from 'graphql-tag';
import { isDefined, run } from './common';

// The GraphQL schema
const typeDefs = gql`
  extend schema @link(url: "https://specs.apollo.dev/federation/v2.12", import: ["@key", "@shareable", "@override"])

  type BookDetails {
    numberOfPages: Int!
  }

  type AlbumDetails {
    numberOfSongs: Int!
  }

  type MagazineDetails {
    numberOfSections: Int!
  }

  union MediaDetails = BookDetails | AlbumDetails | MagazineDetails

  interface Media @key(fields: "id") {
    id: ID!
    typeDetails: MediaDetails
  }

  type Book implements Media @key(fields: "id") {
    id: ID!
    title: String
    typeDetails: BookDetails
  }

  type Album implements Media @key(fields: "id") {
    id: ID!
    title: String
    typeDetails: AlbumDetails
  }

  type Magazine implements Media @key(fields: "id") {
    id: ID!
    title: String
    typeDetails: MagazineDetails
  }

  type Customer @key(fields: "id") @shareable {
    id: ID!
    name: String
    email: String @override(from: "subgraph-c")
  }

  extend type Query {
    customer: Customer!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Media: {
    __resolveType: async (media: { typeDetails: { numberOfPages?: number; numberOfSongs?: number; numberOfSections?: number } }) => {
      if (isDefined(media.typeDetails.numberOfPages)) {
        return 'Book';
      } else if (isDefined(media.typeDetails.numberOfSongs)) {
        return 'Album';
      } else if (isDefined(media.typeDetails.numberOfSections)) {
        return 'Magazine';
      }
      return null;
    },

    __resolveReference: async ({ id }: { id: string }) => {
      if (id === '1') {
        return { id, title: 'Lord of the rings', typeDetails: { __typename: 'BookDetails', numberOfPages: 555 } };
      } else if (id === '2') {
        return { id, title: 'Thriller', typeDetails: { __typename: 'AlbumDetails', numberOfSongs: 9 } };
      }

      return { id, title: 'Ok', typeDetails: { __typename: 'MagazineDetails', numberOfSections: 5 } };
    },
  },
  Query: {
    customer: (_: unknown, __: unknown) => ({ id: 'my id', name: `Customer my id` }),
  },
};

export const runA = () => run(typeDefs, resolvers, 3001, 'subgraph-a');
