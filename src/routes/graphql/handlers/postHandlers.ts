import { Post } from '@prisma/client';
import { PrismaAppData, MissedArgs } from '../interfaces/app.interface.js';

export const postHandlers = {
  post: getPost,
  posts: getPosts,
  createPost: createPost,
  changePost: changePost,
  deletePost: deletePost,
};

async function getPost({ id }: { id: string }, { prisma }: PrismaAppData) {
  const post = await prisma.post.findUnique({ where: { id } });
  return post;
}

async function getPosts(_: MissedArgs, { prisma }: PrismaAppData) {
  const posts = await prisma.post.findMany();
  return posts;
}

async function createPost({ dto: data }: { dto: Post }, { prisma }: PrismaAppData) {
  const post = await prisma.post.create({ data });
  return post;
}

async function changePost(
  { id, dto: data }: { id: string } & { dto: Partial<Post> },
  { prisma }: PrismaAppData,
) {
  try {
    const post = await prisma.post.update({
      where: { id },
      data,
    });
    return post;
  } catch {
    return null;
  }
}

async function deletePost({ id }: { id: string }, { prisma }: PrismaAppData) {
  try {
    await prisma.post.delete({ where: { id } });
    return id;
  } catch {
    return null;
  }
}
