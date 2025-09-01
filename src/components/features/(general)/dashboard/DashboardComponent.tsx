"use client";
import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { Progress } from "@mr/components/ui/Progress";
import { CircleGaugeIcon, ClockArrowDownIcon, ReceiptTextIcon, SendIcon, TextQuoteIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { TotalConsumersCard } from "./TotalConsumersCard";

export const DashboardComponent: FunctionComponent = () => {
  const router = useRouter();

  return (
    <div className="mt-4 flex w-full flex-col gap-4">
      {/* Welcome */}
      <div className="mb-1 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Billed"
          className="border bg-white dark:bg-gray-900"
          icon={<ReceiptTextIcon className="text-gray-700" />}
        >
          <div className="text-primary text-4xl font-bold">1500</div>
          <div className="text-sm text-gray-500">Billed for the month</div>
        </DashboardCard>

        <DashboardCard
          title="Unbilled"
          className="border bg-white dark:bg-gray-900"
          icon={<SendIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">1000</div>
          <div className="text-sm text-gray-500">Unbilled for the month</div>
        </DashboardCard>

        <DashboardCard
          title="With Remarks"
          className="border bg-white dark:bg-gray-900"
          icon={<TextQuoteIcon className="text-gray-700" />}
        >
          <div className="text-primary text-4xl font-bold">58</div>
          <div className="text-sm text-gray-500">With remarks for the month</div>
        </DashboardCard>

        <DashboardCard
          title="New Meters"
          className="border bg-white dark:bg-gray-900"
          icon={<CircleGaugeIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">5</div>
          <div className="text-sm text-gray-500">New meters for the month</div>
        </DashboardCard>
      </div>

      {/* Consumers & Readings Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <TotalConsumersCard />
        <DashboardCard
          title="Readings Due"
          className="border bg-white lg:col-span-2 dark:bg-gray-900"
          size="sm"
          icon={<ClockArrowDownIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">65</div>
          <div className="text-sm text-gray-500">Overdue</div>
        </DashboardCard>
      </div>

      {/* Monthly Progress Section */}
      <DashboardCard
        title="Monthly Reading"
        className="col-span-full border bg-white dark:bg-gray-900"
        onButtonClick={() => router.push("/progress/zonebooks")}
      >
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
    </div>
  );
};
