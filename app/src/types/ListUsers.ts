import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { Cognito } from '../aws/cognito';

export type ListUsersArgs = {
  cognito: Cognito;
};

export type ListUserResponse = {
  next: boolean;
  users: Required<UserType>[];
};

export type ListUserParams = {
  page: number;
  size: number;
};
