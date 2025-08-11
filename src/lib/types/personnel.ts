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

// this only refers to meter readers and their default zoneBooks without the due dates
export type MeterReader = Employee & {
  // meterReaderId: string;
  id: string;
  restDay: "sunday" | "saturday" | undefined;
  zoneBooks: Zonebook[];
  // recommendedZonebooks?: Zonebook[];
};

// this refers to meter readers who have assigned zoneBooks in the scheduling entry calendar which should have a due date and disconnection date
export type MeterReaderWithZonebooks = Employee & {
  id: string;
  // meterReaderId: string;
  scheduleMeterReaderId?: string;
  restDay: "sunday" | "saturday" | undefined;
  zoneBooks: ZonebookWithDates[];
  // reassignment: {
  //   isReassigned: boolean;
  //   reassignedTo: string; // meter reader id
  //   remarks: string; // leave etc.
  // };

  // recommendedZonebooks?: ZonebookWithDates[];
};
