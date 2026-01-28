export type AccountDetails = {
  id: string;
  readingDate: string | null;
  accountNumber: string;
  checkDigit: string;
  accountName: string;
  // address: string;
  currentReading: number;
  previousReading: number;
  averageUsage: number;
  isRead: boolean;
  isPosted: boolean;
  isCompleted: boolean;
  isCommitted: boolean;
  remarks: string;
  additionalRemarks: string;
  billedAmount: number;
  // consumption: number;
  // statusProgress: "read" | "pending" | "unbilled";
  meterReader: { id: string; name: string };
  zone: string;
  book: string;
  meterNumber: string;
};

export type BilledAccount = AccountDetails & {
  usage: number;
};

export type WithRemarksAccount = BilledAccount & {
  remarks: string;
};

export type NewMeterAccount = BilledAccount & {
  remarks: string;
  dateTime: string;
};

export type UnbilledAccount = Pick<AccountDetails, "accountName" | "book" | "zone" | "accountNumber">;

export const TAB_VALUES = {
  BILLED: "billed",
  UNBILLED: "unbilled",
  WITH_REMARKS: "with-remarks",
  NEW_METERS: "new-meters",
} as const;

export type TabValue = (typeof TAB_VALUES)[keyof typeof TAB_VALUES];

export type MeterReadingReportParams = {
  monthYear: string;
  zone: string;
  book: string;
  meterReaderId: string;
};
