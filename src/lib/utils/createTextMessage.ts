import { Concessionaire } from "../types/concessionaire";
import { TextMessage, TextMessageStatus } from "../types/text-message";

export function createTextMessage(recipient: Concessionaire, message: string, sent: boolean, status: TextMessageStatus): TextMessage {
  return {
  textMessageId: `txn_${recipient.consumerId}`,
  senderId: "GSCWD",
  message,
  consumerId: recipient.consumerId,
  accountNo: recipient.accountNo,
  concessionaireName: recipient.concessionaireName,
  primaryContactNumber: recipient.primaryContactNumber,
  secondaryContactNumber: recipient.secondaryContactNumber || "",
  billedAmount: recipient.billedAmount,
  dateSent: new Date().toISOString(),
  sent,
  billMonthYear: recipient.billMonthYear,
  dueDate: recipient.dueDate,
  disconnectionDate: recipient.disconnectionDate,
  status,
};
}
