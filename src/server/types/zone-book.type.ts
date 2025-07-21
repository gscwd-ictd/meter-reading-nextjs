import { z } from "zod";

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
