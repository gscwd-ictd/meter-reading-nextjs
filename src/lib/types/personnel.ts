import { Zonebook } from "./zonebook";

export type Employee = {
  name: string;
  employeeId: string;
  companyId: string;
  assignment: string;
  mobileNumber: string;
  positionTitle: string;
  photoUrl: string;
};

export type MeterReader = Employee & {
  restDay: "sunday" | "saturday" | undefined;
  zonebooks: Zonebook[];
};
