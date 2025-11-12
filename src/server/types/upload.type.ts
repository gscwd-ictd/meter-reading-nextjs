import z from "zod";

export const UploadImageSchema = z.object({
  file: z.instanceof(File),
});

export type UploadImage = z.infer<typeof UploadImageSchema>;
