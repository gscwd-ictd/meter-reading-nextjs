import { Report } from "../enums/reports";

export type ReportType =
  | {
      selectedReport: Report.METER_READING_SCHEDULE;
      from: string; // yyyy-MM-dd
      to: string; // yyyy-MM-dd
    }
  | {
      selectedReport: Report.MONTHLY_BILLING_SUMMARY;
      month: string; // yyyy-MM
    }
  | {
      selectedReport: Report.SUMMARY_OF_BILLS;
      from: string;
      to: string;
      includeDisconnections?: boolean;
    }
  | {
      selectedReport: undefined;
    };
