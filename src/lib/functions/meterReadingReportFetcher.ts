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

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/billed`, {
    params: {
      ...(monthYear && { readingMonth: monthYear }),
      ...(zone && { zone }),
      ...(book && { book }),
      ...(meterReaderId && { meterReaderId }),
    },
  });

  return res.data as BilledAccount[];
};

export const fetchUnbilledAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/unbilled`, {
    params: {
      ...(monthYear && { readingMonth: monthYear }),
      ...(zone && { zone }),
      ...(book && { book }),
      ...(meterReaderId && { meterReaderId }),
    },
  });

  return res.data as UnbilledAccount[];
};

export const fetchWithRemarksAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/with-remarks`, {
    params: {
      ...(monthYear && { readingMonth: monthYear }),
      ...(zone && { zone }),
      ...(book && { book }),
      ...(meterReaderId && { meterReaderId }),
    },
  });

  return res.data as WithRemarksAccount[];
};

export const fetchNewMetersAccounts = async (params: MeterReadingReportParams) => {
  const { book, meterReaderId, monthYear, zone } = params;

  const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/new-meters`, {
    params: {
      ...(monthYear && { readingMonth: monthYear }),
      ...(zone && { zone }),
      ...(book && { book }),
      ...(meterReaderId && { meterReaderId }),
    },
  });

  return res.data as NewMeterAccount[];
};
