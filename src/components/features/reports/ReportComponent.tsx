"use client";
import { Card } from "@mr/components/ui/Card";
import { Label } from "@radix-ui/react-label";
import { FunctionComponent } from "react";
import { SelectReports } from "./SelectReports";
import { ReportsProvider } from "@mr/components/providers/ReportsProvider";
import { SelectedReportOptions } from "./SelectedReportOptions";

export const ReportComponent: FunctionComponent = () => {
  return (
    <ReportsProvider>
      <div className="flex w-full justify-center">
        <Card className="w-full sm:w-full md:w-[75%] lg:w-[50%]">
          <div className="flex flex-1 flex-col">
            <div className="flex flex-col items-start gap-0 p-4">
              <Label
                htmlFor="report-name"
                className="text-left text-sm font-medium text-gray-700 dark:text-white"
              >
                Report name
              </Label>
              <SelectReports />
            </div>
            <SelectedReportOptions />
          </div>
        </Card>
      </div>
    </ReportsProvider>
  );
};
