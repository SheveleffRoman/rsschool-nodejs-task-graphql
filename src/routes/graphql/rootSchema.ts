import { GraphQLObjectType, GraphQLSchema } from 'graphql';

export const MyAppQueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: {},
});

export const MyAppMutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {},
});

export const MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType,
  mutation: MyAppMutationRootType,
});
