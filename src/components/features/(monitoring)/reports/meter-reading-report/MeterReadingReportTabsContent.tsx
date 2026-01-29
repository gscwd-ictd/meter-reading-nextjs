"use client";

import { BilledTabReport } from "./billed/BilledTabReport";
import { UnBilledTabReport } from "./unbilled/UnbilledTabReport";
import { WithRemarksTabReport } from "./with-remarks/WithRemarksTabReport";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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

  // form the params object
  const params: MeterReadingReportParams = {
    monthYear: monthYear,
    zone: watch("zone"),
    book: watch("book"),
    meterReaderId: watch("meterReader.id"),
  };

  const queries = {
    billed: {
      data: queryClient.getQueryData<BilledAccount[]>([
        "get-billed-mr-report",
        params.monthYear ? params.monthYear : "",
      ]),
      isLoading:
        queryClient.getQueryState(["get-billed-mr-report", params.monthYear ? params.monthYear : ""])
          ?.status === "pending"
          ? true
          : false,
    },

    unbilled: {
      data: queryClient.getQueryData<UnbilledAccount[]>([
        "get-unbilled-mr-report",
        params.monthYear ? params.monthYear : "",
      ]),
      isLoading:
        queryClient.getQueryState(["get-unbilled-mr-report", params.monthYear ? params.monthYear : ""])
          ?.status === "pending"
          ? true
          : false,
    },
    withRemarks: {
      data: queryClient.getQueryData<WithRemarksAccount[]>([
        "get-with-remarks-mr-report",
        params.monthYear ? params.monthYear : "",
      ]),
      isLoading:
        queryClient.getQueryState(["get-with-remarks-mr-report", params.monthYear ? params.monthYear : ""])
          ?.status === "pending"
          ? true
          : false,
    },
    newMeters: {
      data: queryClient.getQueryData<NewMeterAccount[]>([
        "get-new-meters-mr-report",
        params.monthYear ? params.monthYear : "",
      ]),
      isLoading:
        queryClient.getQueryState(["get-new-meters-mr-report", params.monthYear ? params.monthYear : ""])
          ?.status === "pending"
          ? true
          : false,
    },
  };

  return (
    <>
      {/* Billed Tab */}
      <BilledTabReport
        data={queries.billed.data ? queries.billed.data : undefined}
        isLoading={queries.billed.isLoading}
      />
      {/* Unbilled Tab */}
      <UnBilledTabReport
        data={queries.unbilled.data ? queries.unbilled.data : undefined}
        isLoading={queries.unbilled.isLoading}
      />
      {/* With Remarks Tab */}
      <WithRemarksTabReport
        data={queries.withRemarks.data ? queries.withRemarks.data : undefined}
        isLoading={queries.withRemarks.isLoading}
      />
      {/* New Meters Tab */}
      <NewMetersTabReport
        data={queries.newMeters.data ? queries.newMeters.data : undefined}
        isLoading={queries.newMeters.isLoading}
      />
    </>
  );
};
