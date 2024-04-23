import { z } from 'zod';
import { confirm_forgot_password_schema } from '../schemas/forgot_password';
import { login_schema } from '../schemas/login';

export type LoginRequest = z.infer<typeof login_schema>;

export type ConfirmForgotPasswordRequest = z.infer<typeof confirm_forgot_password_schema>;
