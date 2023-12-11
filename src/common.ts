import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { ApolloServerPluginUsageReportingDisabled, ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { DocumentNode } from 'graphql';
import { GraphQLResolverMap } from '@apollo/subgraph/dist/schema-helper';

export const isDefined = <T>(arg?: null | T) => arg !== undefined && arg !== null;

export const run = async (typeDefs: DocumentNode | DocumentNode[], resolvers: GraphQLResolverMap<unknown>, port: number) => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
    plugins: [ApolloServerPluginUsageReportingDisabled(), ApolloServerPluginInlineTraceDisabled()],
  });

  return startStandaloneServer(server, {
    listen: { port },
  });
};
