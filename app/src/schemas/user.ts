import { z } from 'zod';

export const create_user_schema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string()
});

export const get_user_schema = z.object({
  username: z.string()
});
