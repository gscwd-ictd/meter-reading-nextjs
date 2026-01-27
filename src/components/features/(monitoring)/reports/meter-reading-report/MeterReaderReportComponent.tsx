"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { MeterReadingReportHeader } from "./MeterReadingReportHeader";
import { MeterReadingReportBody } from "./MeterReadingReportBody";
import { useEffect } from "react";
import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  BilledAccount,
  MeterReadingReportParams,
  NewMeterAccount,
  UnbilledAccount,
  WithRemarksAccount,
} from "@mr/lib/types/accounts";
import {
  fetchBilledAccounts,
  fetchNewMetersAccounts,
  fetchUnbilledAccounts,
  fetchWithRemarksAccounts,
} from "@mr/lib/functions/meterReadingReportFetcher";
import useManualQuery from "@mr/hooks/use-manual-query";

const formSchema = z.object({
  monthYear: z.string().nullish(),
  meterReader: z.optional(
    z.object({
      name: z.string(),
      positionTitle: z.string(),
      employeeId: z.string(),
      id: z.string(),
    }),
  ),
});

export const MeterReadingReportComponent = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const { setIsGenerating, setHasFetched, monthYear, setMonthYear } = useMeterReadingReportContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthYear: "",
      meterReader: undefined,
    },
  });

  const router = useRouter();

  const params: MeterReadingReportParams = {
    monthYear: monthYear ? monthYear : "",
    meterReaderId: form.watch("meterReader.id") !== undefined ? form.watch("meterReader.id") : "",
    zone: "",
    book: "",
  };

  // Queries enabled only when shouldFetch is true
  const queries = {
    billed: useManualQuery<BilledAccount[]>({
      queryKey: ["get-billed-mr-report", monthYear || ""],
      queryFn: () => fetchBilledAccounts(params),

      retry: 1,
    }),
    unbilled: useManualQuery<UnbilledAccount[]>({
      queryKey: ["get-unbilled-mr-report", monthYear || ""],
      queryFn: () => fetchUnbilledAccounts(params),

      retry: 1,
    }),
    withRemarks: useManualQuery<WithRemarksAccount[]>({
      queryKey: ["get-with-remarks-mr-report", monthYear || ""],
      queryFn: () => fetchWithRemarksAccounts(params),

      retry: 1,
    }),
    newMeters: useManualQuery<NewMeterAccount[]>({
      queryKey: ["get-new-meters-mr-report", monthYear || ""],
      queryFn: () => fetchNewMetersAccounts(params),

      retry: 1,
    }),
  };

  const handleGenerateAll = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);
    setMonthYear(data.monthYear !== undefined ? data.monthYear! : "");

    try {
      // show loading toast
      toast.loading("Generating all reports...", {
        id: "generate-mr-reports",
        position: "top-right",
      });

      // Wait for all queries to complete
      await Promise.all([
        queries.billed.execute(),
        queries.unbilled.execute(),
        queries.withRemarks.execute(),
        queries.newMeters.execute(),
      ]);

      setIsGenerating(false);
      setHasFetched(true);

      toast.success("All reports generated successfully!", {
        id: "generate-mr-reports",
        position: "top-right",
      });

      console.log(data);
    } catch (error) {
      setIsGenerating(false);
      toast.error("Failed to generate reports", {
        id: "generate-mr-reports",
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (date) form.setValue("monthYear", date);
  }, [date]);

  // Sync URL when generatedMonthYear changes (except on user submit)
  useEffect(() => {
    // Don't do anything on initial mount
    if (monthYear) {
      // If no URL param but we have store value, update URL
      router.replace(`/reports/meter-reading-report?date=${monthYear}`);
    }
  }, [monthYear, router]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleGenerateAll)}
        className="flex h-full flex-col space-y-4"
        id="meter-reading-report-form"
      >
        <MeterReadingReportHeader />
        <MeterReadingReportBody />
      </form>
    </FormProvider>
  );
};
