import axios from "axios";
import { MeterReadingReportParams } from "../types/accounts";

export const meterReadingReportMutation = async (params: MeterReadingReportParams) => {
  const res = await axios.patch(`${process.env.NEXT_PUBLIC_MR_BE}/progress/reading`, {
    meterReaderId: params.meterReaderId,
    zone: params.zone,
    book: params.book,
    readingMonth: params.monthYear,
  });

  return res.data;
};
