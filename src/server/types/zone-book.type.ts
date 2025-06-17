import { z } from "zod";

export const ZoneBookSchema = z.object({
  zone: z.string(),
  book: z.string(),
  zoneBook: z.string(),
});

export const AssignedAreaZoneBookSchema = ZoneBookSchema.extend({
  id: z.string(),
  areaId: z.string(),
  area: z.string(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const CreateAssignedZoneBookSchema = AssignedAreaZoneBookSchema.omit({
  id: true,
  zoneBook: true,
  area: true,
  createdAt: true,
  updatedAt: true,
});

export type ZoneBook = z.infer<typeof ZoneBookSchema>;
export type AssignedAreaZoneBook = z.infer<typeof AssignedAreaZoneBookSchema>;
export type CreateAssignedAreaZoneBook = z.infer<typeof CreateAssignedZoneBookSchema>;
