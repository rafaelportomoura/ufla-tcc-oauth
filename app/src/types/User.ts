import { AdminCreateUserRequest } from '@aws-sdk/client-cognito-identity-provider';
import { USER_COMMON_GROUPS } from '../constants/groups';

export type User = {
  username: string;
  email: string;
  password: string;
  'custom:group': string;
};

export type UserGroup = (typeof USER_COMMON_GROUPS)[keyof typeof USER_COMMON_GROUPS];

export type CreateUser = Omit<AdminCreateUserRequest, 'UserPoolId' | 'MessageAction' | 'DesiredDeliveryMediums'>;

export type SetUserPassword = {
  username: string;
  password: string;
};

export type ConfirmForgotPassword = {
  username: string;
  password: string;
  confirmation_code: string;
};
