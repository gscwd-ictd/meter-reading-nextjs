import { z } from "zod";
import { ZoneBookSchema } from "./zone-book.type";

/* route query */
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

/* single array  */
export const DateValueSchema = z.union([z.string(), z.string().array()]);

/* partial details of reading schedule */
export const ScheduleSchema = z.object({
  readingDate: z.string(),
  dueDate: DateValueSchema,
  disconnectionDate: DateValueSchema,
  meterReaders: z
    .object({
      scheduleMeterReaderId: z.string(),
      id: z.string(),
      zoneBooks: ZoneBookSchema.pick({
        zone: true,
        book: true,
        zoneBook: true,
        area: true,
      }).array(),
    })
    .array(),
});

/* full details of reading schedule */
export const ScheduleReadingSchema = z.object({
  readingDate: z.string(),
  dueDate: DateValueSchema,
  disconnectionDate: DateValueSchema,
  meterReaders: z
    .object({
      scheduleMeterReaderId: z.string(),
      id: z.string(),
      employeeId: z.string(),
      companyId: z.string(),
      name: z.string(),
      positionTitle: z.string(),
      mobileNumber: z.string(),
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

/* create a whole month schedule */
export const CreateMonthScheduleSchema = ScheduleSchema.omit({ meterReaders: true })
  .extend({
    meterReaders: z
      .object({
        id: z.string(),
      })
      .array(),
  })
  .strict();

/* create a schedule reading per day and per meter reader */
export const CreateMeterReaderScheduleReadingSchema = z.object({
  scheduleMeterReaderId: z.string(),
  zoneBooks: ZoneBookSchema.pick({
    zone: true,
    book: true,
  })
    .extend({
      dueDate: z.string(),
      disconnectionDate: z.string(),
    })
    .array(),
});

export const ScheduleMeterReaderZoneBookSchema = z.object({
  assigned: ZoneBookSchema.pick({ zone: true, book: true, zoneBook: true, area: true })
    .extend({ dueDate: z.string(), disconnectionDate: z.string() })
    .array(),
  unassigned: ZoneBookSchema.pick({ zone: true, book: true, zoneBook: true, area: true }).array(),
});

export type ScheduleQuery = z.infer<typeof ScheduleQuerySchema>;
export type ScheduleReading = z.infer<typeof ScheduleReadingSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type CreateMonthSchedule = z.infer<typeof CreateMonthScheduleSchema>;
export type CreateMeterReaderScheduleReading = z.infer<typeof CreateMeterReaderScheduleReadingSchema>;
export type ScheduleMeterReaderZoneBook = z.infer<typeof ScheduleMeterReaderZoneBookSchema>;

/*  */

/* export const ScheduleZoneBookSchema = z.object({
  scheduleZoneBookId: z.string(),
  scheduleMeterReaderId: z.string(),
  zone: z.string(),
  book: z.string(),
  dueDate: z.coerce.date(),
  disconnectionDate: z.coerce.date(),
});
 */

// export const CreateMeterReaderScheduleZoneBookSchema = z.object({
//   scheduleMeterReaderId: z.string(),

//   zoneBooks: ZoneBookSchema.omit({ zoneBook: true })
//     .extend({
//       dueDate: z.string(),
//       disconnectionDate: z.string(),
//     })
//     .array(),
// });

//export type CreateMeterReaderScheduleZoneBook = z.infer<typeof CreateMeterReaderScheduleZoneBookSchema>;
