import { BadRequestException } from '@src/utils/errors';
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  name: z.string().min(1),
  startAt: z.string(),
  hour: z.string().nullable(),
  description: z.string().max(255).nullable(),
  endAt: z.string().nullable(),
  color: z.string().nullable().optional(),
  repeat: z.string().nullable(),
  days: z.array(z.number()).min(1),
}).refine(data => {
  if (data.endAt && new Date(data.startAt) > new Date(data.endAt)) {
    throw new BadRequestException("End date must be after start date");
  }
  return true;
}, {
  message: "Invalid date range"
});
