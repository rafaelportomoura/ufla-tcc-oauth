import { z } from 'zod';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { create_user_schema } from '../schemas/user';

export type CreateUser = z.infer<typeof create_user_schema>;

export type User = CreateUser & {
  'custom:group': string;
};

export type UserGroup = (typeof USER_COMMON_GROUPS)[keyof typeof USER_COMMON_GROUPS];

export type SetUserPassword = {
  username: string;
  password: string;
};
