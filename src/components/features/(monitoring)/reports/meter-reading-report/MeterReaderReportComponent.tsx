"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { MeterReadingReportHeader } from "./MeterReadingReportHeader";
import { MeterReadingReportBody } from "./MeterReadingReportBody";
import { useEffect, useState } from "react";
import {
  MeterReadingReportProvider,
  useMeterReadingReportContext,
} from "@mr/components/providers/MeterReadingReportProvider";
import { useSearchParams } from "next/navigation";

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

  const { setIsSubmitted } = useMeterReadingReportContext();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthYear: "",
      meterReader: undefined,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    setIsSubmitted(true);
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
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col space-y-4"
        id="meter-reading-report-form"
      >
        <MeterReadingReportHeader />
        <MeterReadingReportBody />
      </form>
    </FormProvider>
  );
};
