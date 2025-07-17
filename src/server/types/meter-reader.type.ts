import { z } from "zod";
import { RestDayType } from "../db/schemas/meter-readers";
import { ZoneBookSchema } from "./zone-book.type";

export const MeterReaderQuerySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().default(0),
  query: z.string().default(""),
  status: z.enum(["assigned", "unassigned"]),
});

export const MobileNumberSchema = z
  .string()
  .transform((val) => {
    if (val.startsWith("09")) return "+63" + val.slice(1);
    return val;
  })
  .refine((val) => /^\+639\d{9}$/.test(val), {
    message: "Invalid Philippine mobile number. Must be in format +639XXXXXXXXX.",
  });

export const EmployeeDetailsSchema = z.object({
  employeeId: z.string(),
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  photoUrl: z.string(),
});

export const MeterReaderSchemaEnhance = z.object({
  meterReaderId: z.string(),
  employeeId: z.string(),
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  photoUrl: z.string(),
  mobileNumber: MobileNumberSchema,
  restDay: z.enum(RestDayType).transform((val) => (val === "0" ? "sunday" : "saturday")),
  zoneBooks: ZoneBookSchema.omit({ zoneBookId: true, areaId: true }).array(),
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

export const PaginatedEmployeeDetailsSchema = PaginatedSchema.extend({
  items: EmployeeDetailsSchema.array(),
});

export const PaginatedMeterReaderSchemaEnhace = PaginatedSchema.extend({
  items: MeterReaderSchemaEnhance.array(),
});

export const AssignMeterReaderSchema = MeterReaderSchemaEnhance.pick({
  employeeId: true,
  mobileNumber: true,
}).extend({
  restDay: z.enum(RestDayType),
  zoneBooks: ZoneBookSchema.pick({
    zone: true,
    book: true,
  }).array(),
});

/////

// export const PaginatedAssignedMeterReaderSchema = PaginatedSchema.extend({
//   items: AssignedMeterReaderSchema.array(),
// });

export const MeterReaderSchema = z.object({
  meterReaderId: z.string(),
  employeeId: z.string(),
  mobileNumber: MobileNumberSchema,
  restDay: z.enum(RestDayType).transform((val) => (val === "0" ? "sunday" : "saturday")),
  zoneBooks: ZoneBookSchema.omit({ zoneBookId: true, areaId: true, area: true }).array(),
});

export const UnassignedMeterReaderSchema = MeterReaderSchema.omit({
  meterReaderId: true,
  restDay: true,
  zoneBooks: true,
  mobileNumber: true,
}).extend({
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  photoUrl: z.string(),
  totalCount: z.number().nullable().optional(),
});

export const AssignedMeterReaderSchema = MeterReaderSchema.extend({
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  photoUrl: z.string(),
  totalCount: z.number().nullable().optional(),
});

export const PaginatedUnassignedMeterReaderSchema = PaginatedSchema.extend({
  items: UnassignedMeterReaderSchema.array(),
});

export const PaginatedAssignedMeterReaderSchema = PaginatedSchema.extend({
  items: AssignedMeterReaderSchema.array(),
});

export const CreateAssignedMeterReaderSchema = AssignedMeterReaderSchema.omit({
  meterReaderId: true,
  restDay: true,
  zoneBooks: true,
  companyId: true,
  name: true,
  positionTitle: true,
  assignment: true,
  photoUrl: true,
  totalCount: true,
})
  .extend({
    restDay: z.enum(RestDayType),
    zoneBooks: ZoneBookSchema.omit({ zoneBook: true }).array(),
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

export type MeterReader = z.infer<typeof MeterReaderSchema>;

export type UnassignedMeterReader = z.infer<typeof UnassignedMeterReaderSchema>;
export type PaginatedUnassignedMeterReader = z.infer<typeof PaginatedUnassignedMeterReaderSchema>;

export type AssignedMeterReader = z.infer<typeof AssignedMeterReaderSchema>;
export type PaginatedAssignedMeterReader = z.infer<typeof PaginatedAssignedMeterReaderSchema>;

export type CreateAssignedMeterReader = z.infer<typeof CreateAssignedMeterReaderSchema>;

//

export type EmployeeDetails = z.infer<typeof EmployeeDetailsSchema>;
export type MeterReaderEnhance = z.infer<typeof MeterReaderSchemaEnhance>;

export type PaginatedEmployeeDetails = z.infer<typeof PaginatedEmployeeDetailsSchema>;
export type PaginatedMeterReaderEnhance = z.infer<typeof PaginatedMeterReaderSchemaEnhace>;

export type AssignMeterReader = z.infer<typeof AssignMeterReaderSchema>;
