import { MeterReadingSchedule } from "./schedule";
import { Zonebook } from "./zonebook";

export type Employee = {
  name: string;
  employeeId: string;
  companyId: string;
  mobileNumber: string;
  positionTitle: string;
  photoUrl: string;
  isMeterReader?: boolean;
};

export type MeterReader = Employee & { restDay: "sunday" | "saturday" | undefined; zonebooks: Zonebook[] };

export type ScheduleWithReaders = Array<
  MeterReadingSchedule & { meterReaders: Array<{ companyId: string }> }
>;
