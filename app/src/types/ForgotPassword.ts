import { z } from 'zod';
import { Cognito } from '../aws/cognito';
import { confirm_forgot_password_schema, forgot_password_schema } from '../schemas/forgot_password';

export type ForgotPassword = z.infer<typeof forgot_password_schema>;

export type ForgotPasswordArgs = {
  cognito: Cognito;
};

export type ConfirmForgotPassword = z.infer<typeof confirm_forgot_password_schema>;

export type ConfirmForgotPasswordArgs = {
  cognito: Cognito;
};
