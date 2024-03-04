import { GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLSchema } from 'graphql';
import { memberType, memberTypeIdEnum } from './types/memberTypes.js';
import { postType } from './types/postTypes.js';
import { profileType } from './types/profileTypes.js';
import { userType } from './types/userTypes.js';
import { UUIDType } from './types/uuidTypes.js';

export const MyAppQueryRootType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    users: {
      type: new GraphQLList(userType),
    },
    memberType: {
      type: memberType,
      args: {
        id: { type: new GraphQLNonNull(memberTypeIdEnum) },
      },
    },
    memberTypes: {
      type: new GraphQLList(memberType),
    },
    post: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    posts: {
      type: new GraphQLList(postType),
    },
    profile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
    },
    profiles: {
      type: new GraphQLList(profileType),
    },
  },
});

export const MyAppMutationRootType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {},
});

export const MyAppSchema = new GraphQLSchema({
  query: MyAppQueryRootType,
  mutation: MyAppMutationRootType,
});
