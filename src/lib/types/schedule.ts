import { MeterReaderWithZonebooks } from "./personnel";

// without meterReaders
export type MeterReadingSchedule = {
  id?: string;
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
};

export type MeterReadingEntryWithZonebooks = {
  id: string;
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
  meterReaders?: MeterReaderWithZonebooks[];
};
