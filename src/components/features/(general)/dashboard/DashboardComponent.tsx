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
    <div className="mt-4 flex w-full flex-col gap-6">
      {/* Welcome */}
      <div className="mb-1 text-xl font-bold text-gray-800 dark:text-white">Welcome back</div>

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
        title="Monthly Reading Progress"
        className="col-span-full border bg-white dark:bg-gray-900"
        icon={`${(1500 / 2500) * 100}%`}
        onButtonClick={() => router.push("/progress/zonebooks")}
      >
        <div className="space-y-2">
          <Progress value={(1500 / 2500) * 100} />
          <div className="text-sm text-gray-500">1500 out of 2500</div>
        </div>
      </DashboardCard>
    </div>
  );
};
