import { MeterReader } from "./personnel";

export type MeterReadingEntry = {
  readingDate: Date;
  dueDate: Date | Date[] | undefined;
  disconnectionDate: Date | Date[] | undefined;
  meterReaders?: MeterReader[];
};
