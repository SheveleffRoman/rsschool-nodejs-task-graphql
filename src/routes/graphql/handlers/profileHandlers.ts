import { Profile } from '@prisma/client';
import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';

export const profileHandlers = {
  profile: getProfile,
  profiles: getProfiles,
  createProfile: createProfile,
  changeProfile: changeProfile,
  deleteProfile: deleteProfile,
};

async function getProfile({ id }: { id: string }, { prisma }: PrismaAppData) {
  return await prisma.profile.findUnique({ where: { id } });
}

async function getProfiles(_: MissedArgs, { prisma }: PrismaAppData) {
  return await prisma.profile.findMany();
}

async function createProfile({ dto: data }: { dto: Profile }, { prisma }: PrismaAppData) {
  try {
    return await prisma.profile.create({ data });
  } catch {
    return null;
  }
}

async function changeProfile(
  { id, dto: data }: { id: string } & { dto: Partial<Profile> },
  { prisma }: PrismaAppData,
) {
  try {
    return await prisma.profile.update({
      where: { id },
      data,
    });
  } catch {
    return null;
  }
}

async function deleteProfile({ id }: { id: string }, { prisma }: PrismaAppData) {
  try {
    await prisma.profile.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
}
