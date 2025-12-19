export type Account = {
  accountNo: string;
  name: string;
  zone: string;
  book: string;
};

export type AccountDetails = {
  id: number;
  accountNumber: string;
  accountName: string;
  address: string;
  previousReading: number;
  currentReading: number | null;
  consumption: number;
  statusProgress: "read" | "pending" | "unbilled";
  meterReader: string;
  readingDate: string;
};

export type BilledAccount = Account & {
  billedAmount: number;
  usage: number;
};

export type WithRemarksAccount = BilledAccount & {
  remarks: string;
};

export type UnbilledAccount = Account;
