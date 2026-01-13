"use client";

import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
import { Tabs, TabsList, TabsTrigger } from "@mr/components/ui/Tabs";
import { CircleGaugeIcon, ReceiptTextIcon, SearchIcon, SendIcon, TextQuoteIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@mr/components/ui/Select";
import { MeterReadingReportTabsContent } from "./MeterReadingReportTabsContent";
import { FunctionComponent } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@mr/components/ui/Empty";
import { Spinner } from "@mr/components/ui/Spinner";

export const MeterReadingReportBody: FunctionComponent = () => {
  const { hasFetched, selectedTab, setSelectedTab, isGenerating } = useMeterReadingReportContext();

  // handle the selected tab
  const onSelectedTabValueChange = (selectedTab: string) => {
    setSelectedTab(
      selectedTab === "billed"
        ? "billed"
        : selectedTab === "unbilled"
          ? "unbilled"
          : selectedTab === "with-remarks"
            ? "with-remarks"
            : "new-meters",
    );
  };

  return (
    <>
      <div className="flex h-full flex-col sm:hidden md:flex lg:flex">
        {hasFetched && !isGenerating ? (
          <Tabs
            value={selectedTab}
            onValueChange={(value) => onSelectedTabValueChange(value)}
            className="flex h-full w-full flex-col"
          >
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

            {/* Tab Content Here */}
            <MeterReadingReportTabsContent />
          </Tabs>
        ) : !hasFetched && !isGenerating ? (
          <Empty className="flex h-full w-full">
            <EmptyHeader className="text-center">
              <EmptyMedia variant="icon">
                <SearchIcon className="h-12 w-12 text-gray-400" />
              </EmptyMedia>
              <EmptyTitle className="mt-4 text-lg font-semibold">Filter month and year</EmptyTitle>
              <EmptyDescription className="mt-0">
                Try adjusting the year month or meter reader selection
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-0">
              <p className="text-xs text-gray-500">After finalizing, press the generate button</p>
            </EmptyContent>
          </Empty>
        ) : (
          <Spinner />
        )}
      </div>

      {/* Mobile View */}

      <div className="flex h-full flex-col gap-2 sm:flex md:flex lg:hidden">
        <Select
          value={selectedTab}
          defaultValue="billed"
          onValueChange={(value) => onSelectedTabValueChange(value)}
        >
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
