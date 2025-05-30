export type Consumer = {
  consumerId: string;
  accountNo: string;
  concessionaireName: string;
  primaryContactNumber: string;
  secondaryContactNumber?: string;
  currentBill: number;
  dueDate: string;
  disconnectionDate: string;
};
