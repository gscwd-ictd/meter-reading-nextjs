"use client";
import { Card } from "@mr/components/ui/Card";
import { Label } from "@radix-ui/react-label";
import { FunctionComponent } from "react";
import { SelectReports } from "./SelectReports";
import { SelectedReportOptions } from "./SelectedReportOptions";
import { FormProvider, useForm } from "react-hook-form";
import { ReportType } from "@mr/lib/types/reports";
import { z } from "zod";

export const baseSchema = z.enum(["mr-schedule", "monthly-billing-summary", "bills-summary"]);

export const ReportComponent: FunctionComponent = () => {
  const methods = useForm<ReportType>({
    defaultValues: {
      selectedReport: undefined,
      from: undefined,
      includeDisconnections: undefined,
      month: undefined,
      to: undefined,
    },
  });

  return (
    <FormProvider {...methods}>
      <div className="flex w-full justify-center">
        <Card className="dark:bg-muted w-full rounded-xl border bg-white shadow-md sm:w-full md:w-[75%] lg:w-[50%]">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col items-start space-y-2 p-4">
              <Label
                htmlFor="report-name"
                className="text-left text-sm font-medium text-gray-700 dark:text-white"
              >
                Report name
              </Label>
              <SelectReports />
            </div>
            <div className="mt-4 border-t px-4 pt-4">
              <SelectedReportOptions />
            </div>
          </div>
        </Card>
      </div>
    </FormProvider>
  );
};
