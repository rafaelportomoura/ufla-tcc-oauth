import { z } from 'zod';
import { Cognito } from '../aws/cognito';
import { KMS } from '../aws/kms';
import { login_schema } from '../schemas/login';

export type Login = z.infer<typeof login_schema>;

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expiration_time: number;
  token_type: string;
  group?: string;
};

export type LoginArgs = {
  cognito: Cognito;
  kms: KMS;
};
