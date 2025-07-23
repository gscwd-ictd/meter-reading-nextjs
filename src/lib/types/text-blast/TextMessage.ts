export type TextMessageData = {
  textMessageId: string;
  dateCreated: string;

  contactNumber: string | null;
  accountNumber: string;
  consumerName: string;
  message: string;
  status: TextMessageStatus;
};

export type TextMessage = Omit<TextMessageData, "textMessageId" | "dateCreated">;

export enum TextMessageStatus {
  SENT = "Sent",
  FAILED = "Failed",
  PENDING = "Pending",
}
