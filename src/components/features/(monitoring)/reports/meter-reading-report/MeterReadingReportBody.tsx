"use client";

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@mr/components/ui/Empty";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mr/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@mr/components/ui/Tabs";
import { CircleGaugeIcon, FilterX, ReceiptTextIcon, SendIcon, TextQuoteIcon } from "lucide-react";
import { FunctionComponent, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BilledTabReport } from "./billed/BilledTabReport";
import { UnBilledTabReport } from "./unbilled/UnbilledTabReport";
import { WithRemarksTabReport } from "./with-remarks/WithRemarksTabReport";

interface MeterReadingReportBodyProps {
  isSubmitted: boolean;
}

export const MeterReadingReportBody: FunctionComponent<MeterReadingReportBodyProps> = ({ isSubmitted }) => {
  const [selectedTab, setSelectedTab] = useState<string>("billed");

  const form = useFormContext();
  const { watch } = form;

  const dateRange = watch("dateRange");
  const meterReader = watch("meterReader");

  const isFormValid = dateRange && meterReader;

  return (
    <>
      <div className="flex h-full flex-col sm:hidden md:flex lg:flex">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex h-full w-full flex-col">
          <TabsList className="flex-shrink-0 space-x-2 bg-transparent">
            <TabsTrigger
              value="billed"
              className="data-[state=active]:bg-primary data-[state=inactive]:hover:bg-primary/40 w-[160px] rounded-md text-sm font-bold text-slate-700 transition-all data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-white"
            >
              <ReceiptTextIcon className="h-4 w-4" /> Billed
            </TabsTrigger>
            <TabsTrigger
              value="unbilled"
              className="data-[state=active]:bg-primary data-[state=inactive]:hover:bg-primary/40 w-[160px] rounded-md text-sm font-bold text-slate-700 transition-all data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-white"
            >
              <SendIcon className="h-4 w-4" /> Unbilled
            </TabsTrigger>
            <TabsTrigger
              value="with-remarks"
              className="data-[state=active]:bg-primary data-[state=inactive]:hover:bg-primary/40 w-[160px] rounded-md text-sm font-bold text-slate-700 transition-all data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-white"
            >
              <TextQuoteIcon className="h-4 w-4" /> With Remarks
            </TabsTrigger>
            <TabsTrigger
              value="new-meters"
              className="data-[state=active]:bg-primary data-[state=inactive]:hover:bg-primary/40 w-[160px] rounded-md text-sm font-bold text-slate-700 transition-all data-[state=active]:text-white data-[state=inactive]:bg-transparent data-[state=inactive]:hover:text-white"
            >
              <CircleGaugeIcon className="h-4 w-4" /> New Meters
            </TabsTrigger>
          </TabsList>

          {/* Billed Tab */}
          <TabsContent value="billed" className="mt-0 flex-1">
            <div className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6">
              {/* <Empty>
                <EmptyHeader className="text-center">
                  <EmptyMedia variant="icon">
                    <ReceiptTextIcon className="h-12 w-12 text-gray-400" />
                  </EmptyMedia>
                  <EmptyTitle className="mt-4 text-lg font-semibold">No Billed Accounts</EmptyTitle>
                  <EmptyDescription className="mt-0">
                    No billed accounts match your current filters
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-0">
                  <p className="text-xs text-gray-500">
                    Try adjusting your date range or meter reader selection
                  </p>
                </EmptyContent>
              </Empty> */}
              <BilledTabReport />
            </div>
          </TabsContent>

          {/* Unbilled Tab */}
          <TabsContent value="unbilled" className="mt-0 flex-1">
            <div className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6">
              {/* <Empty className="h-auto">
                <EmptyHeader className="text-center">
                  <EmptyMedia variant="icon">
                    <SendIcon className="h-12 w-12 text-gray-400" />
                  </EmptyMedia>
                  <EmptyTitle className="mt-4 text-lg font-semibold">Unbilled Accounts</EmptyTitle>
                  <EmptyDescription className="mt-0">
                    No unbilled accounts found for the selected criteria
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-0">
                  <p className="text-xs text-gray-500">
                    All accounts in this period may have been billed already
                  </p>
                </EmptyContent>
              </Empty> */}
              <UnBilledTabReport />
            </div>
          </TabsContent>

          {/* With Remarks Tab */}
          <TabsContent value="with-remarks" className="mt-0 flex-1">
            <div className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6">
              {/* <Empty className="h-auto">
                <EmptyHeader className="text-center">
                  <EmptyMedia variant="icon">
                    <TextQuoteIcon className="h-12 w-12 text-gray-400" />
                  </EmptyMedia>
                  <EmptyTitle className="mt-4 text-lg font-semibold">Accounts with Remarks</EmptyTitle>
                  <EmptyDescription className="mt-0">
                    No accounts with remarks found for the selected criteria
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-0">
                  <p className="text-xs text-gray-500">
                    All readings were completed without additional remarks
                  </p>
                </EmptyContent>
              </Empty> */}
              <WithRemarksTabReport />
            </div>
          </TabsContent>

          {/* New Meters Tab */}
          <TabsContent value="new-meters" className="mt-0 flex-1">
            <div className="flex h-full flex-col items-center justify-center rounded-md border bg-gray-50 p-6">
              <Empty className="h-auto">
                <EmptyHeader className="text-center">
                  <EmptyMedia variant="icon">
                    <CircleGaugeIcon className="h-12 w-12 text-gray-400" />
                  </EmptyMedia>
                  <EmptyTitle className="mt-4 text-lg font-semibold">New Meters</EmptyTitle>
                  <EmptyDescription className="mt-0">
                    No new meters found for the selected criteria
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="mt-0">
                  <p className="text-xs text-gray-500">No new meter installations in the selected period</p>
                </EmptyContent>
              </Empty>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile View */}

      <div className="flex h-full flex-col gap-2 sm:flex md:flex lg:hidden">
        <Select value={selectedTab} defaultValue="billed" onValueChange={setSelectedTab}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="billed">Billed</SelectItem>
            <SelectItem value="unbilled">Unbilled</SelectItem>
            <SelectItem value="with-remarks">With Remarks</SelectItem>
            <SelectItem value="new-meters">New Meters</SelectItem>
          </SelectContent>
        </Select>

        {/* Select Content */}
        <div className="mt-0 flex-1">
          <div className="h-full rounded-md border bg-gray-50 p-4 sm:h-[400px] md:h-full lg:h-full">
            Accounts with new meters here
          </div>
        </div>
      </div>
    </>
  );
};
