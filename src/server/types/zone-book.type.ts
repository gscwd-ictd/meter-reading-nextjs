import { z } from "zod";

/* export const ZoneBookSchema = z.object({
  zone: z.string(),
  book: z.string(),
  zoneBook: z.string(),
});

export const AssignedAreaZoneBookSchema = ZoneBookSchema.extend({
  zoneBookId: z.string(),
  areaId: z.string(),
  area: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const CreateAssignedZoneBookSchema = AssignedAreaZoneBookSchema.omit({
  zoneBookId: true,
  zoneBook: true,
  area: true,
  createdAt: true,
  updatedAt: true,
});

export type ZoneBook = z.infer<typeof ZoneBookSchema>;
export type AssignedAreaZoneBook = z.infer<typeof AssignedAreaZoneBookSchema>;
export type CreateAssignedAreaZoneBook = z.infer<typeof CreateAssignedZoneBookSchema>; */

export const ZoneBookSchema = z.object({
  zoneBookId: z.string(),
  zone: z.string(),
  book: z.string(),
  zoneBook: z.string(),
  areaId: z.string(),
  area: z.string(),
});

export const AssignZoneBookAreaSchema = ZoneBookSchema.pick({
  zone: true,
  book: true,
  areaId: true,
});

export const UpdateZoneBookAreaSchema = ZoneBookSchema.pick({
  areaId: true,
});

export type ZoneBook = z.infer<typeof ZoneBookSchema>;
export type AssignZoneBookArea = z.infer<typeof AssignZoneBookAreaSchema>;
export type UpdateZoneBookArea = z.infer<typeof UpdateZoneBookAreaSchema>;
