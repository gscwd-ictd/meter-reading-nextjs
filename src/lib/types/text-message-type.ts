export type TextMessageType = {
  typeId: string;
  messageType: TextMessageEnum;
};

export enum TextMessageEnum {
  NOTICE = "Notice",
  AFTER_DUE_DATE = "After Due Date"
}