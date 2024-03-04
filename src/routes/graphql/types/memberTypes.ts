import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { MemberTypeId } from '../../member-types/schemas.js';
import { profileType } from './profileTypes.js';
import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';
import { MemberType } from '@prisma/client';

export const memberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    [MemberTypeId.BASIC]: {
      value: MemberTypeId.BASIC,
    },
    [MemberTypeId.BUSINESS]: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const memberType = new GraphQLObjectType({
  name: 'Member',
  fields: () => ({
    id: { type: memberTypeIdEnum },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: async (
        source: MemberType,
        _: MissedArgs,
        { profilesByMemberTypeIdLoader }: PrismaAppData,
      ) => profilesByMemberTypeIdLoader.load(source.id),
    },
  }),
});
