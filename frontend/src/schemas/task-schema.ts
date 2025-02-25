import { z } from "zod";

const taskSchema = z.object({
  name:   z.string(),
  days:   z.array(z.boolean()),
  description: z.string().max(255).nullable(),
  hour:   z.string().nullable().optional(),
  repeat: z.union([z.boolean(), z.string()]).nullable(),
  endAt:  z.string().optional().nullable(),
  color: z.string().nullable(),
  startAt: z.string(),
});

type TaskSchema = z.infer<typeof taskSchema>

export { taskSchema, type TaskSchema };

