export type Account = {
  accountNo: string;
  name: string;
  zone: string;
  book: string;
};

export type AccountDetails = {
  id: number;
  readingDate: string | null;
  accountNumber: string;
  checkDigit: string;
  accountName: string;
  // address: string;
  currentReading: number;
  previousReading: number;
  averageUsage: number;
  billedAmount: number;
  isRead: boolean;
  isPosted: boolean;
  isCompleted: boolean;
  isCommitted: boolean;
  remarks: string;
  additionalRemarks: string;
  // consumption: number;
  // statusProgress: "read" | "pending" | "unbilled";
  meterReader: { id: string; name: string };
};

export type BilledAccount = Account & {
  billedAmount: number;
  usage: number;
};

export type WithRemarksAccount = BilledAccount & {
  remarks: string;
};

export type UnbilledAccount = Account;
