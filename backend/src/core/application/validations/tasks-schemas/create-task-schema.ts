import { z } from 'zod';

export const CreateTaskSchema = z.object({
  name: z.string().min(1),
  startAt: z.string(),
  hour: z.string().nullable(),
  description: z.string().max(255).nullable(),
  endAt: z.string().nullable(),
  repeat: z.union([z.literal('weekly'), z.literal(false)]),
  days: z.array(z.number()).min(1),
});
