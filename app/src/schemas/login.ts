import { z } from 'zod';

export const login_schema = z.object({
  username: z.string(),
  password: z.string()
});
