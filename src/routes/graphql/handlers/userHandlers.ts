import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

import { GraphQLList, GraphQLResolveInfo } from 'graphql';
import {
  MissedArgs,
  PrismaAppData,
  SubscriptionMutationInput,
} from '../interfaces/app.interface.js';
import { userType } from '../types/userTypes.js';
import { User } from '@prisma/client';

export const userHandlers = {
  user: getUser,
  users: getUsers,
  createUser: createUser,
  changeUser: changeUser,
  deleteUser: deleteUser,
  subscribeTo: subscribeTo,
  unsubscribeFrom: unsubscribeFrom,
};

async function getUser({ id }: { id: string }, { userLoader }: PrismaAppData) {
  return userLoader.load(id);
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

async function createUser({ dto: data }: { dto: User }, { prisma }: PrismaAppData) {
  return prisma.user.create({ data });
}

async function changeUser(
  { id, dto: data }: { id: string } & { dto: Partial<User> },
  { prisma }: PrismaAppData,
) {
  try {
    return await prisma.user.update({
      where: { id },
      data,
    });
  } catch {
    return null;
  }
}

async function deleteUser({ id }: { id: string }, { prisma }: PrismaAppData) {
  try {
    await prisma.user.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
}

async function subscribeTo(
  { userId: id, authorId }: SubscriptionMutationInput,
  { prisma }: PrismaAppData,
) {
  try {
    return prisma.user.update({
      where: { id },
      data: { userSubscribedTo: { create: { authorId } } },
    });
  } catch {
    return null;
  }
}

async function unsubscribeFrom(
  { userId: subscriberId, authorId }: SubscriptionMutationInput,
  { prisma }: PrismaAppData,
) {
  try {
    await prisma.subscribersOnAuthors.delete({
      where: { subscriberId_authorId: { subscriberId, authorId } },
    });
  } catch {
    return null;
  }
}
