import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';

export const postHandlers = {
  post: getPost,
  posts: getPosts,
};

async function getPost({ id }: { id: string }, { prisma }: PrismaAppData) {
  const post = await prisma.post.findUnique({ where: { id } });
  return post;
}

async function getPosts(_: MissedArgs, { prisma }: PrismaAppData) {
  const posts = await prisma.post.findMany();
  return posts;
}
