import z from "zod";

export const ReadingRemarkSchema = z.object({
  id: z.string(),
  name: z.string(),
  isAverage: z.coerce.boolean().nullish(),
  isActive: z.coerce.boolean().nullish(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export const CreateReadingRemarkSchema = ReadingRemarkSchema.pick({
  name: true,
  isAverage: true,
  isActive: true,
}).extend({
  name: z.string().min(1, "reading remark name is required"),
});

export const UpdateReadingRemarkSchema = CreateReadingRemarkSchema.partial();

export type ReadingRemark = z.infer<typeof ReadingRemarkSchema>;
export type CreateReadingRemark = z.infer<typeof CreateReadingRemarkSchema>;
export type UpdateReadingRemark = z.infer<typeof UpdateReadingRemarkSchema>;
