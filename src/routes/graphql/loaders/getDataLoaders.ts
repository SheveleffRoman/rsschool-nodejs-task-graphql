import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { MemberTypeId } from '../../member-types/schemas.js';
import { DataLoaders } from '../interfaces/dataLoaders.interface.js';

export function getDataLoaders(prisma: PrismaClient): DataLoaders {
  return {
    postsByAuthorIdLoader: new DataLoader((ids) =>
      getBatchedPostsByAuthorId(prisma, ids),
    ),
    profileByUserIdLoader: new DataLoader((ids) =>
      getBatchedProfileByUserId(prisma, ids),
    ),
    profilesByMemberTypeIdLoader: new DataLoader((ids) =>
      getBatchedProfilesByMemberTypeId(prisma, ids as MemberTypeId[]),
    ),
    memberTypeLoader: new DataLoader((ids) => getBatchedMemberType(prisma, ids)),
    userLoader: new DataLoader((ids) => getBatchedUserById(prisma, ids)),
  };
}

async function getBatchedPostsByAuthorId(prisma: PrismaClient, ids: readonly string[]) {
  const posts = await prisma.post.findMany({
    where: { authorId: { in: [...ids] } },
  });

  const postMap: Record<string, Post[]> = {};
  posts.forEach((post) => {
    postMap[post.authorId] = postMap[post.authorId]
      ? [...postMap[post.authorId], post]
      : [post];
  });

  return ids.map((id) => postMap[id] || []);
}

async function getBatchedProfileByUserId(prisma: PrismaClient, ids: readonly string[]) {
  const profiles = await prisma.profile.findMany({
    where: { userId: { in: [...ids] } },
  });

  const profileMap: Record<string, Profile> = {};
  profiles.forEach((profile) => (profileMap[profile.userId] = profile));

  return ids.map((id) => profileMap[id] || null);
}

async function getBatchedProfilesByMemberTypeId(
  prisma: PrismaClient,
  ids: readonly MemberTypeId[],
) {
  const profiles = await prisma.profile.findMany({
    where: { memberTypeId: { in: [...ids] } },
  });

  const profileMap: Record<MemberTypeId, Profile[]> = {
    [MemberTypeId.BASIC]: [],
    [MemberTypeId.BUSINESS]: [],
  };
  profiles.forEach((profile) => {
    const list = profileMap[profile.memberTypeId] || [];
    profileMap[profile.memberTypeId] = [...list, profile];
  });

  return ids.map((id) => profileMap[id] || []);
}

async function getBatchedMemberType(prisma: PrismaClient, ids: readonly MemberTypeId[]) {
  const memberTypes = await prisma.memberType.findMany({
    where: { id: { in: [...ids] } },
  });

  const memberTypeMap: Record<MemberTypeId, MemberType> = {
    [MemberTypeId.BASIC]: {
      id: '',
      discount: 0,
      postsLimitPerMonth: 0,
    },
    [MemberTypeId.BUSINESS]: {
      id: '',
      discount: 0,
      postsLimitPerMonth: 0,
    },
  };
  memberTypes.forEach((memberType) => (memberTypeMap[memberType.id] = memberType));

  return ids.map((id) => memberTypeMap[id] || null);
}

async function getBatchedUserById(prisma: PrismaClient, ids: readonly string[]) {
  const users = await prisma.user.findMany({
    where: { id: { in: [...ids] } },
    include: {
      userSubscribedTo: true,
      subscribedToUser: true,
    },
  });

  const userMap: Record<string, User> = {};
  users.forEach((user) => (userMap[user.id] = user));

  return ids.map((id) => userMap[id] || null);
}
