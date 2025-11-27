"use client";
import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { Progress } from "@mr/components/ui/Progress";
import {
  CircleGaugeIcon,
  ClockArrowDownIcon,
  ClockIcon,
  ReceiptTextIcon,
  SendIcon,
  TextQuoteIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { TotalConsumersCard } from "./TotalConsumersCard";
import { ConsumptionCard } from "./ConsumptionCard";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { Badge } from "@mr/components/ui/Badge";

const mockReadingWithRemarks: Array<Omit<WithRemarksAccount, "billedAmount" | "usage">> = [
  { accountNo: "457487545", zone: "1", book: "62", name: "Elizabeth Lopez", remarks: "PE Leak Before Meter" },
  { accountNo: "524878444", zone: "2", book: "1", name: "John Doe", remarks: "Stuck-up Meter" },
  { accountNo: "225487325", zone: "6", book: "5", name: "Aleena Fischer", remarks: "Tilted Meter" },
];

export const DashboardComponent: FunctionComponent = () => {
  const router = useRouter();

  return (
    <div className="mt-4 flex w-full flex-col gap-6 sm:gap-4 md:gap-4 lg:gap-6">
      {/* Welcome */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4 md:gap-4 lg:grid-cols-4 lg:gap-6">
        <DashboardCard
          title="Billed"
          className="border bg-cyan-200/30 dark:bg-gray-900"
          icon={<ReceiptTextIcon className="size-8 text-cyan-700 sm:size-6 md:size-6 lg:size-8" />}
        >
          <div className="dark:text-primary text-4xl font-bold text-gray-800">1500</div>
          <div className="text-sm text-gray-500">Billed for the month</div>
        </DashboardCard>

        <DashboardCard
          title="Unbilled"
          className="border bg-pink-100/70 dark:bg-gray-900"
          icon={<SendIcon className="size-8 text-pink-600 sm:size-6 md:size-6 lg:size-8" />}
        >
          <div className="dark:text-primary text-4xl font-bold text-gray-800">1000</div>
          <div className="text-sm text-gray-500">Unbilled for the month</div>
        </DashboardCard>

        <DashboardCard
          title="With Remarks"
          className="border bg-violet-200/60 dark:bg-gray-900"
          icon={<TextQuoteIcon className="size-8 text-violet-700 sm:size-6 md:size-6 lg:size-8" />}
        >
          <div className="dark:text-primary text-4xl font-bold text-gray-800">58</div>
          <div className="text-sm text-gray-500">With remarks for the month</div>
        </DashboardCard>

        <DashboardCard
          title="New Meters"
          className="border bg-sky-200/90 dark:bg-gray-900"
          icon={<CircleGaugeIcon className="size-8 text-sky-600 sm:size-6 md:size-6 lg:size-8" />}
        >
          <div className="dark:text-primary text-4xl font-bold text-gray-800">5</div>
          <div className="text-sm text-gray-500">New meters for the month</div>
        </DashboardCard>
      </div>

      {/* Consumers & Readings Section */}
      <div className="grid grid-cols-1 gap-6 sm:gap-4 md:gap-4 lg:grid-cols-5 lg:gap-6">
        <ConsumptionCard />
        <TotalConsumersCard />
      </div>

      {/* Bottom Part */}
      <div className="grid min-h-0 grid-cols-1 gap-6 sm:gap-4 md:gap-4 lg:grid-cols-5 lg:gap-6">
        {/* Monthly Progress */}
        <DashboardCard
          size="sm"
          className="col-span-3 border bg-white dark:bg-gray-900"
          onButtonClick={() => router.push("/progress/zonebooks")}
          title="Monthly Progress"
        >
          {/* <div className="mb-2 text-base font-medium">Monthly Progress</div> */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium">{Math.round((1500 / 2500) * 100)}%</span>
            </div>
            <Progress value={(1500 / 2500) * 100} />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1500 of 2500 completed</span>
              <span>{2500 - 1500} remaining</span>
            </div>
          </div>
        </DashboardCard>

        {/* With Remarks Details - Fixed scrolling */}
        <DashboardCard
          size="sm"
          className="col-span-2 flex min-h-0 flex-col border bg-white sm:col-span-3 md:col-span-3 lg:col-span-2 dark:bg-gray-900"
          title="Reading with Remarks"
        >
          {/* Header */}
          {/* <div className="mb-2 text-base font-medium">Reading with Remarks</div> */}

          {/* Scrollable Content */}
          <div className="flex h-[10rem] flex-1 flex-col overflow-hidden">
            <div className="overflow-y-auto">
              <div className="flex flex-col gap-2">
                {/* Add more items to test scrolling */}
                {mockReadingWithRemarks.map((reading, idx) => {
                  return (
                    <div
                      key={idx}
                      className="rounded-lg border border-gray-200/60 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                              #{reading.accountNo}
                            </div>
                            <div className="text-xs text-gray-500">•</div>
                            <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                              {reading.name}
                            </div>
                          </div>
                          <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                            {reading.remarks}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <ClockIcon className="size-3" />
                          <span>7d</span>
                        </div>
                      </div>
                      <div className="mt-2 flex gap-2 text-xs">
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          Zone {reading.zone}
                        </span>
                        <span className="rounded-full bg-gray-200 px-2 py-1 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          Book {reading.book}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
