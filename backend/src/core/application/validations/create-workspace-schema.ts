import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'name is required field'),
  userId: z.string().min(1, 'session not found!')
});
