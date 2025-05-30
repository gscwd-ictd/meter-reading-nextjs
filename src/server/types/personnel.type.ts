import { z } from "zod";

export const PersonnelSchema = z.object({
  employeeId: z.string(),
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  mobileNumber: z.string(),
  photoUrl: z.string(),
});

export const PersonnelQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  query: z.string().optional().default(""),
});

export type Personnel = z.infer<typeof PersonnelSchema>;
