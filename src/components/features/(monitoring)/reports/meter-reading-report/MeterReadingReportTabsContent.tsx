"use client";

import { BilledTabReport } from "./billed/BilledTabReport";
import { UnBilledTabReport } from "./unbilled/UnbilledTabReport";
import { WithRemarksTabReport } from "./with-remarks/WithRemarksTabReport";
import { useQuery } from "@tanstack/react-query";
import { BilledAccount, MeterReadingReportParams } from "@mr/lib/types/accounts";
import {
  fetchBilledAccounts,
  fetchNewMetersAccounts,
  fetchUnbilledAccounts,
  fetchWithRemarksAccounts,
} from "@mr/lib/functions/meterReadingReportFetcher";
import { useFormContext } from "react-hook-form";
import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
import { NewMetersTabReport } from "./new-meters/NewMetersTabReport";

export const MeterReadingReportTabsContent = () => {
  const { isGenerating } = useMeterReadingReportContext();

  const form = useFormContext();
  const { watch } = form;

  // form the params object
  const params: MeterReadingReportParams = {
    monthYear: watch("monthYear"),
    zone: watch("zone"),
    book: watch("book"),
    meterReaderId: watch("meterReader.id"),
  };

  // create an object for all queries
  const queries = {
    billed: useQuery<BilledAccount[]>({
      queryKey: ["get-billed-mr-report"],
      queryFn: () => fetchBilledAccounts(params),
      enabled: isGenerating,
    }),
    unbilled: useQuery({
      queryKey: ["get-unbilled-mr-report"],
      queryFn: () => fetchUnbilledAccounts(params),
      enabled: isGenerating,
    }),
    withRemarks: useQuery({
      queryKey: ["get-with-remarks-mr-report"],
      queryFn: () => fetchWithRemarksAccounts(params),
      enabled: isGenerating,
    }),
    newMeters: useQuery({
      queryKey: ["get-new-meters-mr-report"],
      queryFn: () => fetchNewMetersAccounts(params),

      enabled: isGenerating,
    }),
  };

  return (
    <>
      {/* Billed Tab */}
      <BilledTabReport data={queries.billed.data} isLoading={queries.billed.isLoading} />

      {/* Unbilled Tab */}
      <UnBilledTabReport data={queries.unbilled.data} isLoading={queries.unbilled.isLoading} />

      {/* With Remarks Tab */}
      <WithRemarksTabReport data={queries.withRemarks.data} isLoading={queries.withRemarks.isLoading} />

      {/* New Meters Tab */}
      <NewMetersTabReport data={queries.newMeters.data} isLoading={queries.newMeters.isLoading} />
    </>
  );
};
