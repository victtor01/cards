import { z } from 'zod';

export const CreateCardValidation = z.object({
  title: z.string({ message: 'title is required!' }).min(1, 'expect title of card!'),
  content: z.string({ message: 'content of card is required!' }).max(500).optional(),
  workspaceId: z
    .string({ message: 'workspaceId is required!' })
    .min(1, 'this card is workspace required!'),
});
