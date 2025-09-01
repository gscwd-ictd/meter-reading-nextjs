import z from "zod";

export const ConsumerCountSchema = z.object({
  total: z.coerce.number(),
  active: z.coerce.number(),
  disconnected: z.coerce.number(),
  writeOff: z.coerce.number(),
});

export type ConsumerCount = z.infer<typeof ConsumerCountSchema>;
