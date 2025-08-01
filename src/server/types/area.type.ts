import { z } from "zod";

/*
 * Zod schemas for Area data validation.
 *
 * - AreaSchema: Full area structure with ID and timestamps.
 * - CreateAreaSchema: For creating a new area (requires non-empty name).
 * - UpdateAreaSchema: For partial updates (all fields optional).
 *
 * Types:
 * - Area: Full area type.
 * - CreateArea: Input type for creating.
 * - UpdateArea: Input type for updating.
 */

export const AreaSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export const CreateAreaSchema = AreaSchema.pick({
  name: true,
}).extend({
  name: z.string().min(1, "area name is required"),
});

export const UpdateAreaSchema = CreateAreaSchema.pick({
  name: true,
});

export type Area = z.infer<typeof AreaSchema>;
export type CreateArea = z.infer<typeof CreateAreaSchema>;
export type UpdateArea = z.infer<typeof UpdateAreaSchema>;
