import { Cognito } from '../aws/cognito';
import { KMS } from '../aws/kms';
import { UserGroup } from './User';

export type CreateUserArgs = {
  cognito: Cognito;
  kms: KMS;
  group: UserGroup;
};
