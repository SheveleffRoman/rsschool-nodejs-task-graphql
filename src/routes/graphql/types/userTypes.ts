import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from './uuidTypes.js';
import { MissedArgs, PrismaAppData } from '../interfaces/app.interface.js';
import { profileType } from './profileTypes.js';
import { postType } from './postTypes.js';
import { User } from '../interfaces/user.interface.js';

export const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: profileType,
      resolve: async (
        source: User,
        _: MissedArgs,
        { profileByUserIdLoader }: PrismaAppData,
      ) => profileByUserIdLoader.load(source.id),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (
        source: User,
        _: MissedArgs,
        { postsByAuthorIdLoader }: PrismaAppData,
      ) => postsByAuthorIdLoader.load(source.id),
    },
    userSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (source: User, _: MissedArgs, { userLoader }: PrismaAppData) =>
        source.userSubscribedTo
          ? userLoader.loadMany(source.userSubscribedTo.map(({ authorId }) => authorId))
          : null,
    },
    subscribedToUser: {
      type: new GraphQLList(userType),
      resolve: async (source: User, _: MissedArgs, { userLoader }: PrismaAppData) =>
        source.subscribedToUser
          ? userLoader.loadMany(
              source.subscribedToUser.map(({ subscriberId }) => subscriberId),
            )
          : null,
    },
  }),
});

export const createUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const changeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});
