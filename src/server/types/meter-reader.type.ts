import { z } from "zod";
import { RestDayType } from "../db/schemas/meter-readers";
import { ZoneBookSchema } from "./zone-book.type";

export const MeterReaderQuerySchema = z.object({
  page: z.coerce.number().default(0),
  limit: z.coerce.number().default(0),
  query: z.string().default(""),
  status: z.enum(["assigned", "unassigned"]),
});

export const MobileNumberSchema = z.string().refine((val) => /^09\d{9}$/.test(val), {
  message: "Invalid Philippine mobile number. It must start with 09 and be exactly 11 digits.",
});

export const EmployeeDetailsSchema = z.object({
  employeeId: z.string(),
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  photoUrl: z.string(),
});

export const MeterReaderDetailsSchema = z.object({
  meterReaderId: z.string(),
  employeeId: z.string(),
  companyId: z.string(),
  name: z.string(),
  positionTitle: z.string(),
  assignment: z.string(),
  mobileNumber: MobileNumberSchema,
  photoUrl: z.string(),
});

export const MeterReaderSchema = MeterReaderDetailsSchema.extend({
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

export const PaginatedMeterReaderSchema = PaginatedSchema.extend({
  items: MeterReaderSchema.array(),
});

export const AssignMeterReaderSchema = MeterReaderSchema.pick({
  employeeId: true,
  mobileNumber: true,
}).extend({
  restDay: z.enum(RestDayType),
  zoneBooks: ZoneBookSchema.pick({
    zone: true,
    book: true,
  }).array(),
});

export type EmployeeDetails = z.infer<typeof EmployeeDetailsSchema>;
export type MeterReaderDetails = z.infer<typeof MeterReaderDetailsSchema>;
export type MeterReader = z.infer<typeof MeterReaderSchema>;
export type PaginatedEmployeeDetails = z.infer<typeof PaginatedEmployeeDetailsSchema>;
export type PaginatedMeterReader = z.infer<typeof PaginatedMeterReaderSchema>;
export type AssignMeterReader = z.infer<typeof AssignMeterReaderSchema>;
