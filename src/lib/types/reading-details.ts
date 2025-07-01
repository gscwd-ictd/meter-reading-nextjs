export type ReadingDetails = {
  account_no: string;
  present_reading: number;
  usage: number;
  billed_amount: number;
  reading_date: string;
  meter_reader_id: string;
  due_date: string;
  disconnection_date: string;
  remarks: string;
  additional_remarks: string;
  photo: Blob;
  isPosted: boolean;
  penalty: number;
};
