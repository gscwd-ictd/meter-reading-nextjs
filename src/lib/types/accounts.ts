export type Account = {
  accountNo: string;
  name: string;
  zone: string;
  book: string;
};

export type BilledAccount = Account & {
  billedAmount: number;
  usage: number;
};

export type WithRemarksAccount = BilledAccount & {
  remarks: string;
};

export type UnbilledAccount = Account;
