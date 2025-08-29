import { z } from "zod";
import { AreaSchema } from "./area.type";

export const ZoneBookSchema = z.object({
  id: z.string(),
  zone: z.string(),
  book: z.string(),
  zoneBook: z.string(),
  area: AreaSchema.pick({
    id: true,
    name: true,
  }),
});

export const AssignZoneBookAreaSchema = ZoneBookSchema.pick({
  zone: true,
  book: true,
}).extend({
  area: z.object({
    id: z.string().nullish(),
  }),
});

export const UpdateZoneBookAreaSchema = AssignZoneBookAreaSchema.pick({
  zone: true,
  book: true,
})
  .partial()
  .extend({
    area: z.object({
      id: z.string().nullish(),
    }),
  });

export type ZoneBook = z.infer<typeof ZoneBookSchema>;
export type AssignZoneBookArea = z.infer<typeof AssignZoneBookAreaSchema>;
export type UpdateZoneBookArea = z.infer<typeof UpdateZoneBookAreaSchema>;
