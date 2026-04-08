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
  zone: z.string().optional(),
  book: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const MeterReadingReportComponent = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const { setIsGenerating, setHasFetched, monthYear, setMonthYear, hasFetched } =
    useMeterReadingReportContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthYear: "",
      meterReader: undefined,
      zone: "",
      book: "",
    },
  });

  const router = useRouter();

  // Initialize queries with the fetcher functions
  const billedQuery = useManualQuery<BilledAccount[], MeterReadingReportParams>({
    queryKey: ["get-billed-mr-report"],
    queryFn: fetchBilledAccounts,
    retry: 1,
  });

  const unbilledQuery = useManualQuery<UnbilledAccount[], MeterReadingReportParams>({
    queryKey: ["get-unbilled-mr-report"],
    queryFn: fetchUnbilledAccounts,
    retry: 1,
  });

  const withRemarksQuery = useManualQuery<WithRemarksAccount[], MeterReadingReportParams>({
    queryKey: ["get-with-remarks-mr-report"],
    queryFn: fetchWithRemarksAccounts,
    retry: 1,
  });

  const newMetersQuery = useManualQuery<NewMeterAccount[], MeterReadingReportParams>({
    queryKey: ["get-new-meters-mr-report"],
    queryFn: fetchNewMetersAccounts,
    retry: 1,
  });

  const handleGenerateAll = async (data: FormValues) => {
    setIsGenerating(true);
    const selectedMonthYear = data.monthYear !== undefined ? data.monthYear : "";
    setMonthYear(selectedMonthYear);

    // Build the params object conditionally
    const paramsObject = {
      monthYear: selectedMonthYear,
      ...(form.watch("meterReader.id") && { meterReaderId: form.watch("meterReader.id") }),
      ...(form.watch("book") && { book: form.watch("book") }),
      ...(form.watch("zone") && { zone: form.watch("zone") }),
    };

    // Assert the type since we know it matches the structure
    const currentParams = paramsObject as MeterReadingReportParams;

    console.log(currentParams);
    try {
      toast.loading("Generating all reports...", {
        id: "generate-mr-reports",
        position: "top-right",
      });

      // Pass the current params to each execute function
      await Promise.all([
        billedQuery.execute(currentParams),
        unbilledQuery.execute(currentParams),
        withRemarksQuery.execute(currentParams),
        // newMetersQuery.execute(currentParams),
      ]);

      setIsGenerating(false);
      setHasFetched(true);

      toast.success("All reports generated successfully!", {
        id: "generate-mr-reports",
        position: "top-right",
      });
    } catch (error) {
      console.error("Generation error:", error);
      setIsGenerating(false);
      toast.error("Failed to generate reports", {
        id: "generate-mr-reports",
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (date) form.setValue("monthYear", date);
  }, [date, form]);

  // Sync URL when monthYear changes
  useEffect(() => {
    if (monthYear) {
      router.replace(`/reports/meter-reading-report?date=${monthYear}`);
    }
  }, [monthYear, router]);

  useEffect(() => {
    // Reset hasFetched when any filter changes
    const subscription = form.watch(() => {
      if (hasFetched) {
        setHasFetched(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, hasFetched, setHasFetched]);

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
