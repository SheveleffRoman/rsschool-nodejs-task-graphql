import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';

export const profileHandlers = {
  profile: getProfile,
  profiles: getProfiles,
};

async function getProfile({ id }: { id: string }, { prisma }: PrismaAppData) {
  return await prisma.profile.findUnique({ where: { id } });
}

async function getProfiles(_: MissedArgs, { prisma }: PrismaAppData) {
  return await prisma.profile.findMany();
}
