import { z } from "zod";
import { ZoneBookSchema } from "./zone-book.type";

export const ScheduleQuerySchema = z.object({
  date: z.string().refine(
    (val) =>
      /^\d{4}-\d{2}$/.test(val) || // Matches YYYY-MM
      /^\d{4}-\d{2}-\d{2}$/.test(val), // Matches YYYY-MM-DD
    {
      message: "Invalid date format. Use YYYY-MM or YYYY-MM-DD.",
    },
  ),
});

export const DateValueSchema = z.union([z.string(), z.string().array()]);

export const ScheduleReadingSchema = z.object({
  readingDate: z.string(),
  dueDate: DateValueSchema,
  disconnectionDate: DateValueSchema,
  meterReaders: z
    .object({
      scheduleMeterReaderId: z.string(),
      meterReaderId: z.string(),
      employeeId: z.string(),
      companyId: z.string(),
      name: z.string(),
      positionTitle: z.string(),
      assignment: z.string(),
      photoUrl: z.string(),
      zoneBooks: ZoneBookSchema.pick({
        zone: true,
        book: true,
        zoneBook: true,
        area: true,
      }).array(),
    })
    .array(),
});

export const ScheduleSchema = z.object({
  readingDate: z.string(),
  dueDate: DateValueSchema,
  disconnectionDate: DateValueSchema,
  meterReaders: z
    .object({
      scheduleMeterReaderId: z.string(),
      meterReaderId: z.string(),
      zoneBooks: ZoneBookSchema.pick({
        zone: true,
        book: true,
        zoneBook: true,
        area: true,
      }).array(),
    })
    .array(),
});

export type ScheduleQuery = z.infer<typeof ScheduleQuerySchema>;
export type ScheduleReading = z.infer<typeof ScheduleReadingSchema>;

/*  */

export const ScheduleZoneBookSchema = z.object({
  scheduleZoneBookId: z.string(),
  scheduleMeterReaderId: z.string(),
  zone: z.string(),
  book: z.string(),
  dueDate: z.coerce.date(),
  disconnectionDate: z.coerce.date(),
});

export const MeterReaderZoneBookSchema = z.object({
  assigned: ZoneBookSchema.array(),
  unassigned: ZoneBookSchema.array(),
});

export const CreateScheduleSchema = ScheduleSchema.omit({ meterReaders: true })
  .extend({
    meterReaders: z
      .object({
        meterReaderId: z.string(),
      })
      .array(),
  })
  .strict();

export const CreateMeterReaderScheduleZoneBookSchema = z.object({
  scheduleMeterReaderId: z.string(),

  zoneBooks: ZoneBookSchema.omit({ zoneBook: true })
    .extend({
      dueDate: z.string(),
      disconnectionDate: z.string(),
    })
    .array(),
});

export type Schedule = z.infer<typeof ScheduleSchema>;
export type ScheduleZoneBook = z.infer<typeof ScheduleZoneBookSchema>;

export type CreateSchedule = z.infer<typeof CreateScheduleSchema>;

export type CreateMeterReaderScheduleZoneBook = z.infer<typeof CreateMeterReaderScheduleZoneBookSchema>;

export type MeterReaderZoneBook = z.infer<typeof MeterReaderZoneBookSchema>;
