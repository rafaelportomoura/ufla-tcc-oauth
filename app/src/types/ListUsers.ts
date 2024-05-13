import { Cognito } from '../aws/cognito';
import { User } from './User';

export type ListUsersArgs = {
  cognito: Cognito;
};

export type ListUserResponse = {
  next: boolean;
  users: User[];
};

export type ListUserParams = {
  page: number;
  size: number;
};
