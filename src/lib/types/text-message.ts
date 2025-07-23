import { Consumer } from "./consumer";
import { TextMessageType } from "./text-message-type";

export type TextMessage = {
  transactionId: string;
  senderId: string;
  message: string;
  messageType: TextMessageType["typeId"];
  consumerId: Consumer["consumerId"];
  accountNo: Consumer["accountNo"];
  concessionaireName: Consumer["concessionaireName"];
  primaryContactNumber: string;
  secondaryContactNumber?: string;
  dateSent: string;
  sent: boolean;
};
