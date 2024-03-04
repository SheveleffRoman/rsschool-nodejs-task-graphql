import DataLoader from 'dataloader';
import { MemberTypeId, memberTypeSchema } from '../../member-types/schemas.js';
import { postSchema } from '../../posts/schemas.js';
import { Static } from '@sinclair/typebox';
import { profileSchema } from '../../profiles/schemas.js';
import { userSchema } from '../../users/schemas.js';

export type Post = Static<typeof postSchema>;
export type Profile = Static<typeof profileSchema>;
export type MemberType = Static<typeof memberTypeSchema>;
export type User = Static<typeof userSchema>;

export type DataLoaders = {
  postsByAuthorIdLoader: DataLoader<string, Post[]>;
  profileByUserIdLoader: DataLoader<string, Profile>;
  profilesByMemberTypeIdLoader: DataLoader<string, Profile[]>;
  memberTypeLoader: DataLoader<MemberTypeId, MemberType>;
  userLoader: DataLoader<string, User>;
}