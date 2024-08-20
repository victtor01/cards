import { z } from 'zod';

export const updateCardValidation = z.object({
  title: z.string().min(1).max(25).optional(),
  content: z.string().optional(),
});
