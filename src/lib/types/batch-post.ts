export type BatchPost = {
  id: string;
  accountNo: string;
  accountName: string;
  dueDate: string;
  disconnectionDate: string;
  readingDate: string;
  billedAmount: number;
  status: BatchPostStatus;
};

export enum BatchPostStatus {
  POSTED = "Posted",
  NOT_POSTED = "Not Posted",
}
