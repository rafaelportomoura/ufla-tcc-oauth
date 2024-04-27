import { z } from 'zod';

export const token_schema = z.object({
  token: z.string().trim()
});
