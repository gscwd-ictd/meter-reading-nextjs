"use client";

import { BilledTabReport } from "./billed/BilledTabReport";
import { UnBilledTabReport } from "./unbilled/UnbilledTabReport";
import { WithRemarksTabReport } from "./with-remarks/WithRemarksTabReport";
import { useQueryClient } from "@tanstack/react-query";
import {
  BilledAccount,
  MeterReadingReportParams,
  NewMeterAccount,
  UnbilledAccount,
  WithRemarksAccount,
} from "@mr/lib/types/accounts";
import { useFormContext } from "react-hook-form";
import { NewMetersTabReport } from "./new-meters/NewMetersTabReport";
import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";

export const MeterReadingReportTabsContent = () => {
  const form = useFormContext();
  const { watch } = form;
  const queryClient = useQueryClient();
  const { monthYear } = useMeterReadingReportContext();

  // Build params object with conditional inclusion
  const params: MeterReadingReportParams = {
    monthYear: monthYear,
    ...(watch("zone") && { zone: watch("zone") }),
    ...(watch("book") && { book: watch("book") }),
    ...(watch("meterReader.id") && { meterReaderId: watch("meterReader.id") }),
  };

  // Get the latest data from the queries
  const billedData = queryClient.getQueryData<BilledAccount[]>(["get-billed-mr-report", params]);

  const unbilledData = queryClient.getQueryData<UnbilledAccount[]>(["get-unbilled-mr-report", params]);

  const withRemarksData = queryClient.getQueryData<WithRemarksAccount[]>([
    "get-with-remarks-mr-report",
    params,
  ]);

  const newMetersData = queryClient.getQueryData<NewMeterAccount[]>(["get-new-meters-mr-report", params]);

  // Check loading states
  const billedState = queryClient.getQueryState(["get-billed-mr-report", params]);
  const unbilledState = queryClient.getQueryState(["get-unbilled-mr-report", params]);
  const withRemarksState = queryClient.getQueryState(["get-with-remarks-mr-report", params]);
  const newMetersState = queryClient.getQueryState(["get-new-meters-mr-report", params]);

  return (
    <>
      {/* Billed Tab */}
      <BilledTabReport data={billedData} isLoading={billedState?.status === "pending"} />

      {/* Unbilled Tab */}
      <UnBilledTabReport data={unbilledData} isLoading={unbilledState?.status === "pending"} />

      {/* With Remarks Tab */}
      <WithRemarksTabReport data={withRemarksData} isLoading={withRemarksState?.status === "pending"} />

      {/* New Meters Tab */}
      <NewMetersTabReport data={newMetersData} isLoading={newMetersState?.status === "pending"} />
    </>
  );
};
