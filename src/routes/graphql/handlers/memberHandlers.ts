import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';

export const memberHandlers = {
  memberType: getMemberType,
  memberTypes: getMemberTypes,
};

async function getMemberType({ id }: {id: string}, { prisma }: PrismaAppData) {
  return await prisma.memberType.findUnique({ where: { id } });
}

async function getMemberTypes(_: MissedArgs, { prisma }: PrismaAppData) {
  return await prisma.memberType.findMany();
}
