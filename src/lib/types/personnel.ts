import { Zonebook, ZonebookWithDates } from "./zonebook";

export type Employee = {
  name: string;
  employeeId: string;
  companyId: string;
  assignment: string;
  mobileNumber: string;
  positionTitle: string;
  photoUrl: string;
};

// this only refers to meter readers and their default zonebooks without the due dates
export type MeterReader = Employee & {
  restDay: "sunday" | "saturday" | undefined;
  zonebooks: Zonebook[];
  recommendedZonebooks?: Zonebook[];
};

// this refers to meter readers who have assigned zonebooks in the scheduling entry calendar which should have a due date and disconnection date
export type MeterReaderWithZonebooks = Employee & {
  restDay: "sunday" | "saturday" | undefined;
  zonebooks: ZonebookWithDates[];
  recommendedZonebooks?: ZonebookWithDates[];
};
