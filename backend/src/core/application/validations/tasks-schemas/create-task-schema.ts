import { z } from 'zod';

export const CreateTaskSchema = z.object({
  name: z.string().min(1),
  startAt: z.date().optional(),
  endAt: z.date().optional(),
  repeat: z.union([z.literal('weekly'), z.literal(false)]),
  days: z.array(z.number()).min(1),
});
