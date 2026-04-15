import z from "zod";
import { ReadingAccountProgressSchema } from "./report.type";

export const ReadingAccountSchema = ReadingAccountProgressSchema;

export type ReadingAccount = z.infer<typeof ReadingAccountSchema>;
