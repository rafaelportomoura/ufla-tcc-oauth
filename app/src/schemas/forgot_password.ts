import { z } from 'zod';

export const forgot_password_schema = z.object({
  username: z.string()
});

export const confirm_forgot_password_schema = z.object({
  username: z.string(),
  password: z.string(),
  confirmation_code: z.string()
});
