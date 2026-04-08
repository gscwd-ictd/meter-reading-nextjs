"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { MeterReadingReportHeader } from "./MeterReadingReportHeader";
import { MeterReadingReportBody } from "./MeterReadingReportBody";
import { useEffect, useRef } from "react";
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
  const isGeneratingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  // Cancel all ongoing requests
  const cancelAllRequests = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const handleGenerateAll = async (data: FormValues) => {
    // Prevent multiple simultaneous submissions
    if (isGeneratingRef.current) {
      toast.warning("Already generating reports. Please wait...", {
        id: "generate-mr-reports",
        position: "top-right",
      });
      return;
    }

    // Cancel any ongoing requests
    cancelAllRequests();

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    isGeneratingRef.current = true;
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

    let toastId = "generate-mr-reports";

    try {
      toast.loading("Generating all reports...", {
        id: toastId,
        position: "top-right",
      });

      // Pass the current params to each execute function
      await Promise.all([
        billedQuery.execute(currentParams),
        unbilledQuery.execute(currentParams),
        withRemarksQuery.execute(currentParams),
        newMetersQuery.execute(currentParams),
      ]);

      setIsGenerating(false);
      setHasFetched(true);

      toast.success("All reports generated successfully!", {
        id: toastId,
        position: "top-right",
      });
    } catch (error: any) {
      // Don't show error if it was aborted
      if (error?.name === "AbortError" || error?.message?.includes("aborted")) {
        console.log("Request was cancelled");
        return;
      }

      console.error("Generation error:", error);
      toast.error("Failed to generate reports", {
        id: toastId,
        position: "top-right",
      });
    } finally {
      isGeneratingRef.current = false;
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Debounced version of handleGenerateAll to prevent rapid clicks
  const debouncedGenerate = useRef<NodeJS.Timeout | null>(null);
  const onGenerateClick = (data: FormValues) => {
    // Clear any pending debounced call
    if (debouncedGenerate.current) {
      clearTimeout(debouncedGenerate.current);
    }

    // Debounce the actual generation
    debouncedGenerate.current = setTimeout(() => {
      handleGenerateAll(data);
    }, 300); // 300ms debounce
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAllRequests();
      if (debouncedGenerate.current) {
        clearTimeout(debouncedGenerate.current);
      }
    };
  }, []);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onGenerateClick)}
        className="flex h-full flex-col space-y-4"
        id="meter-reading-report-form"
      >
        <MeterReadingReportHeader />
        <MeterReadingReportBody />
      </form>
    </FormProvider>
  );
};
