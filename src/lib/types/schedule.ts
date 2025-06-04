import { MeterReader } from "./personnel";

// without meterReaders
export type MeterReadingSchedule = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
};

export type MeterReadingEntry = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
  meterReaders?: MeterReader[];
};
