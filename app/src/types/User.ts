import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { z } from 'zod';
import { USER_COMMON_GROUPS } from '../constants/groups';
import { create_user_schema } from '../schemas/user';

export type CreateUser = z.infer<typeof create_user_schema>;

export type UserAttributes = {
  sub: string;
  email: string;
  'custom:group': string;
};

export type User = UserAttributes & {
  username: string;
  enabled: boolean;
  created_at: Date;
  updated_at: Date;
  status: UserStatusType;
};

export type UserGroup = (typeof USER_COMMON_GROUPS)[keyof typeof USER_COMMON_GROUPS];

export type SetUserPassword = {
  username: string;
  password: string;
};

export type SetUserPasswordCognito = SetUserPassword & {
  username: string;
  password: string;
  permanent: boolean;
};
