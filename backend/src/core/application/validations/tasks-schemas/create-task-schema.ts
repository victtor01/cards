import { z } from 'zod';

export const CreateTaskSchema = z.object({
  name: z.string().min(1),
  startAt: z.date().nullable(),
  hour: z.string().nullable(),
  description: z.string().max(255).nullable(),
  endAt: z.date().nullable(),
  repeat: z.union([z.literal('weekly'), z.literal(false)]),
  days: z.array(z.number()).min(1),
});
