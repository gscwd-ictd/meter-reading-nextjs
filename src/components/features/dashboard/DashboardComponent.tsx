"use client";
import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { Progress } from "@mr/components/ui/Progress";
import {
  CircleGaugeIcon,
  ClockArrowDownIcon,
  ReceiptTextIcon,
  SendIcon,
  TextQuoteIcon,
  User2Icon,
} from "lucide-react";
import { FunctionComponent } from "react";

export const DashboardComponent: FunctionComponent = () => {
  return (
    <div className="mt-4 flex w-full flex-col gap-5">
      <div className="mb-1 text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 sm:grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4">
        {/* Billed */}
        <DashboardCard
          title="Billed"
          className="border bg-white dark:bg-gray-900"
          icon={<ReceiptTextIcon className="text-gray-700" />}
        >
          <div className="text-primary text-4xl font-bold">1500</div>
          <div className="text-sm text-gray-500">Billed for the month</div>
        </DashboardCard>

        {/* Unbilled */}
        <DashboardCard
          title="Unbilled"
          className="border bg-white dark:bg-gray-900"
          icon={<SendIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">1000</div>
          <div className="text-sm text-gray-500">Unbilled for the month</div>
        </DashboardCard>

        {/* With remarks */}
        <DashboardCard
          title="With Remarks"
          className="border bg-white dark:bg-gray-900"
          icon={<TextQuoteIcon className="text-gray-700" />}
        >
          <div className="text-primary text-4xl font-bold">58</div>
          <div className="text-sm text-gray-500">With remarks for the month</div>
        </DashboardCard>

        {/* New Meters */}
        <DashboardCard
          title="New Meter"
          className="border bg-white dark:bg-gray-900"
          icon={<CircleGaugeIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">5</div>
          <div className="text-sm text-gray-500">New meters for the month</div>
        </DashboardCard>

        {/* Customers */}
        <DashboardCard
          title="Total Customers"
          className="border bg-white lg:col-span-2 dark:bg-gray-900"
          icon={<User2Icon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">2500</div>
          <div className="text-sm text-gray-500">Active </div>
        </DashboardCard>

        {/* Readings Due */}
        <DashboardCard
          title="Readings Due"
          className="border bg-white lg:col-span-2 dark:bg-gray-900"
          icon={<ClockArrowDownIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">65</div>
          <div className="text-sm text-gray-500">Overdue </div>
        </DashboardCard>

        {/* Monthly Progress */}
        <DashboardCard
          title="Monthly Reading Progress"
          className="col-span-full border bg-white dark:bg-gray-900"
          icon={`${(1500 / 2500) * 100}%`}
          onButtonClick={() => {}}
        >
          <div className="space-y-2">
            <Progress
              value={(1500 / 2500) * 100}

              // className="[--progress-background:220_100%_90%] [--progress:220_100%_50%]"
            />
            <div className="text-sm text-gray-500">1500 out of 2500</div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};
