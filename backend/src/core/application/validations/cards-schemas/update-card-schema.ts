import { z } from 'zod';

export const updateCardValidation = z.object({
  title: z.string().min(1).max(60).optional(),
  content: z.string().optional(),
});
