import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from './uuidTypes.js';
import { memberType } from './memberTypes.js';
import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';
import { userType } from './userTypes.js';
import { Profile } from '@prisma/client';
import { MemberTypeId } from '../../member-types/schemas.js';

export const profileType = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(memberType),
      resolve: async (
        source: Profile,
        _: MissedArgs,
        { memberTypeLoader }: PrismaAppData,
      ) => memberTypeLoader.load(source.memberTypeId as MemberTypeId),
    },
    user: {
      type: userType as GraphQLObjectType,
      resolve: async (source: Profile, _: MissedArgs, { userLoader }: PrismaAppData) =>
        userLoader.load(source.userId),
    },
  }),
});
