import { PrismaClient } from '@prisma/client';
import { DataLoaders } from './dataLoaders.interface.js';

export interface Subscription {
  subscriberId: string;
  authorId: string;
}

export interface SubscriptionMutationInput {
  userId: string;
  authorId: string;
}

export type MissedArgs = Record<string | number | symbol, never>;

export interface PrismaAppData extends DataLoaders {
  prisma: PrismaClient;
}
