export type Concessionaire = {
  consumerId: string;
  accountNo: string;
  concessionaireName: string;
  primaryContactNumber: string;
  secondaryContactNumber?: string;
  billedAmount: number;
  billMonthYear: string;
  dueDate: string;
  zone?: number;
  book?: number;
  disconnectionDate: string;
  dateCreated: string;
  dateUpdated: string;
};
