import { z } from "zod";

export const AreaSchema = z.object({
  id: z.string(),
  area: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const CreateAreaSchema = AreaSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateAreaSchema = CreateAreaSchema.partial();

export type Area = z.infer<typeof AreaSchema>;
export type CreateArea = z.infer<typeof CreateAreaSchema>;
export type UpdateArea = z.infer<typeof UpdateAreaSchema>;
