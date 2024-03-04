import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { UUIDType } from './uuidTypes.js';
import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';
import { userType } from './userTypes.js';
import { Post } from '@prisma/client';

export const postType = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: userType,
      resolve: async (source: Post, _: MissedArgs, { userLoader }: PrismaAppData) =>
        userLoader.load(source.authorId),
    },
  }),
});