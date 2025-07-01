import { Concessionaire } from "./concessionaire";

export type TextMessage = {
  textMessageId: string;
  senderId: string;
  message: string;
  consumerId: Concessionaire["consumerId"];
  accountNo: Concessionaire["accountNo"];
  concessionaireName: Concessionaire["concessionaireName"];
  primaryContactNumber: Concessionaire["primaryContactNumber"];
  secondaryContactNumber?: Concessionaire["secondaryContactNumber"];
  billedAmount: number;
  status: TextMessageStatus;
  sent: boolean;
  billMonthYear: string;
  dueDate: string;
  disconnectionDate: string;
  zone: Concessionaire["zone"];
  book: Concessionaire["book"];
  dateSent: string;
  dateCreated: string;
  dateUpdated: string;
};

export enum TextMessageStatus  {
  SENT = "Sent",
  FAILED = "Failed"
}