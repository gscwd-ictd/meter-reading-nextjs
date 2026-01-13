"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { MeterReadingReportHeader } from "./MeterReadingReportHeader";
import { MeterReadingReportBody } from "./MeterReadingReportBody";
import { useEffect } from "react";
import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

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

  const queryClient = useQueryClient();

  const date = searchParams.get("date");

  const { setIsGenerating, setHasFetched } = useMeterReadingReportContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthYear: "",
      meterReader: undefined,
    },
  });

  const handleGenerateAll = async (data: z.infer<typeof formSchema>) => {
    setIsGenerating(true);

    try {
      // show loading toast
      toast.loading("Generating all reports...", { id: "generate-mr-reports" });

      // refetch all queries in parallel
      await Promise.all([
        queryClient.refetchQueries({ queryKey: ["get-billed-mr-report"] }),
        queryClient.refetchQueries({ queryKey: ["get-unbilled-mr-report"] }),
        // queryClient.refetchQueries({ queryKey: ["get-with-remarks-mr-report"] }),
        // queryClient.refetchQueries({ queryKey: ["get-new-meters-mr-report"] }),
      ]);

      toast.success("All reports generated successfully!", {
        id: "generate-mr-reports",
        position: "top-right",
        duration: 800,
      });
    } catch (error) {
      toast.error("Failed to generate reports", {
        id: "generate-mr-reports",
        position: "top-right",
        duration: 1000,
      });
    } finally {
      setIsGenerating(false);
      setHasFetched(true);
      console.log(data);
    }
  };

  useEffect(() => {
    if (date) form.setValue("monthYear", date);
  }, [date]);

  useEffect(() => {
    if (form.formState.errors) console.log(form.formState.errors);
  }, [form.formState.errors]);

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
