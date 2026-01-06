"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import { MeterReadingReportHeader } from "./MeterReadingReportHeader";
import { MeterReadingReportBody } from "./MeterReadingReportBody";
import { useState } from "react";

const formSchema = z.object({
  monthYear: z.string(),
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
  // subscribe if the generate button is clicked or not
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col space-y-4"
        id="meter-reading-report-form"
      >
        <MeterReadingReportHeader />
        <MeterReadingReportBody isSubmitted={isSubmitted} />
      </form>
    </FormProvider>
  );
};
