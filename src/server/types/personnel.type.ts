import { z } from "zod";
import { RestDayType } from "../db/schemas/personnel";
import { ZoneBookSchema } from "./zone-book.type";

export const PersonnelQuerySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().default(0),
  query: z.string().default(""),
  status: z.enum(["assigned", "unassigned"]),
});

export const PersonnelSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  restDay: z.enum(RestDayType),
  zoneBooks: ZoneBookSchema.array(),
});

export const UnassignedPersonnelSchema = PersonnelSchema.omit({
  id: true,
  restDay: true,
  zoneBooks: true,
}).extend({
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  mobileNumber: z.string(),
  photoUrl: z.string(),
  totalCount: z.number().nullable().optional(),
});

export const AssignedPersonnelSchema = PersonnelSchema.extend({
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  mobileNumber: z.string(),
  photoUrl: z.string(),
  totalCount: z.number().nullable().optional(),
  zoneBooks: ZoneBookSchema.array(),
});

export const PaginatedSchema = z.object({
  meta: z.object({
    totalItems: z.number(),
    itemCount: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});

export const PaginatedUnassignedPersonnelSchema = PaginatedSchema.extend({
  items: UnassignedPersonnelSchema.array(),
});

export const PaginatedAssignedPersonnelSchema = PaginatedSchema.extend({
  items: AssignedPersonnelSchema.array(),
});

export const CreateAssignedPersonnelSchema = AssignedPersonnelSchema.omit({
  id: true,
  zoneBooks: true,
  companyId: true,
  name: true,
  positionTitle: true,
  assignment: true,
  mobileNumber: true,
  photoUrl: true,
  totalCount: true,
})
  .extend({
    zoneBooks: ZoneBookSchema.omit({ zoneBook: true })
      .array()
      .min(1, "At least one zone/book pair is required"),
  })
  .superRefine((data, ctx) => {
    const seen = new Set<string>();

    for (const [index, entry] of data.zoneBooks.entries()) {
      const key = `${entry.zone}-${entry.book}`;
      if (seen.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["zoneBooks", index],
          message: "Duplicate zone/book pair is not allowed",
        });
      }
      seen.add(key);
    }
  });

export type Personnel = z.infer<typeof PersonnelSchema>;

export type UnassignedPersonnel = z.infer<typeof UnassignedPersonnelSchema>;
export type PaginatedUnassignedPersonnel = z.infer<typeof PaginatedUnassignedPersonnelSchema>;

export type AssignedPersonnel = z.infer<typeof AssignedPersonnelSchema>;
export type PaginatedAssignedPersonnel = z.infer<typeof PaginatedAssignedPersonnelSchema>;

export type CreateAssignedPersonnel = z.infer<typeof CreateAssignedPersonnelSchema>;
