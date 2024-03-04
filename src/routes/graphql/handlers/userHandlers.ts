import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import { MissedArgs, PrismaAppData } from '../interfaces/app.interface.js';
import { userType } from '../types/userTypes.js';

export const userHandlers = {
  user: getUser,
  users: getUsers,
};

async function getUser({ id }: { id: string }, { userLoader }: PrismaAppData) {
  return await userLoader.load(id);
}

async function getUsers(
  _: MissedArgs,
  { prisma, userLoader }: PrismaAppData,
  resolveInfo: GraphQLResolveInfo,
) {
  const parsedResolveInfoFragment = parseResolveInfo(resolveInfo);
  const { fields }: { fields: { [key in string]: ResolveTree } } =
    simplifyParsedResolveInfoFragmentWithType(
      parsedResolveInfoFragment as ResolveTree,
      new GraphQLList(userType),
    );

  const users = await prisma.user.findMany({
    include: {
      userSubscribedTo: !!fields.userSubscribedTo,
      subscribedToUser: !!fields.subscribedToUser,
    },
  });

  users.forEach((user) => {
    userLoader.prime(user.id, user);
  });

  return users;
}
