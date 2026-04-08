// meterReadingReportFetcher.ts
import axios from "axios";
import {
  BilledAccount,
  MeterReadingReportParams,
  NewMeterAccount,
  UnbilledAccount,
  WithRemarksAccount,
} from "../types/accounts";

export const fetchBilledAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  // Build params object only with defined values
  const queryParams: Record<string, string> = {};

  if (monthYear) queryParams.readingMonth = monthYear;
  if (zone) queryParams.zone = zone;
  if (book) queryParams.book = book;
  if (meterReaderId) queryParams.meterReaderId = meterReaderId;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/billed`, {
    params: queryParams,
  });

  return res.data as BilledAccount[];
};

export const fetchUnbilledAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  // Build params object only with defined values
  const queryParams: Record<string, string> = {};

  if (monthYear) queryParams.readingMonth = monthYear;
  if (zone) queryParams.zone = zone;
  if (book) queryParams.book = book;
  if (meterReaderId) queryParams.meterReaderId = meterReaderId;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/unbilled`, {
    params: queryParams,
  });

  return res.data as UnbilledAccount[];
};

export const fetchWithRemarksAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  // Build params object only with defined values
  const queryParams: Record<string, string> = {};

  if (monthYear) queryParams.readingMonth = monthYear;
  if (zone) queryParams.zone = zone;
  if (book) queryParams.book = book;
  if (meterReaderId) queryParams.meterReaderId = meterReaderId;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/remarks`, {
    params: queryParams,
  });

  return res.data as WithRemarksAccount[];
};

export const fetchNewMetersAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  // Build params object only with defined values
  const queryParams: Record<string, string> = {};

  if (monthYear) queryParams.readingMonth = monthYear;
  if (zone) queryParams.zone = zone;
  if (book) queryParams.book = book;
  if (meterReaderId) queryParams.meterReaderId = meterReaderId;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/new-meter`, {
    //! new-meters
    params: queryParams,
  });

  return res.data as NewMeterAccount[];
};
