import z from "zod";
import { ReadingAccountProgressSchema } from "./report.type";

export const ErpQuerySchema = z.object({
  meterReaderId: z.string().optional(),
  zone: z.coerce.string().optional(),
  book: z.coerce.string().optional(),
  readingMonth: z.coerce.string(),
});

export const ReadingAccountSchema = ReadingAccountProgressSchema;

export type ErqQuery = z.infer<typeof ErpQuerySchema>;
export type ReadingAccount = z.infer<typeof ReadingAccountSchema>;
