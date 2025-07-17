import { MeterReaderWithZonebooks } from "./personnel";

// without meterReaders
export type MeterReadingSchedule = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
};

export type MeterReadingEntryWithZonebooks = {
  scheduleId?: string;
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
  meterReaders?: MeterReaderWithZonebooks[];
};
