import { z } from 'zod';

export const CreateCardSchema = z.object({
  // name: z.string({ message: 'name is required!' }).min(1, 'expect name of card!'),
  title: z.string({ message: 'title is required!' }).min(1, 'expect title of card!'),
  content: z
    .string({ message: 'content of card is required!' })
    .min(1, 'content of card is required!'),
  workspaceId: z.string().min(1, 'this card is workspace required!'),
});
