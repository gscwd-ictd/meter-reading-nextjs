import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { CircleGaugeIcon, ReceiptTextIcon, SendIcon, TextQuoteIcon } from "lucide-react";
import { FunctionComponent } from "react";

export const DashboardComponent: FunctionComponent = () => {
  return (
    <div className="mt-5 flex w-full flex-col gap-5">
      <div className="text-2xl font-bold text-gray-800">Welcome back</div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-1 sm:grid-rows-4 md:grid-cols-2 md:grid-rows-2 lg:grid-cols-4">
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
          title="New Meter"
          className="border bg-white dark:bg-gray-900"
          icon={<CircleGaugeIcon className="text-gray-600" />}
        >
          <div className="text-primary text-4xl font-bold">5</div>
          <div className="text-sm text-gray-500">New meters for the month</div>
        </DashboardCard>
      </div>
    </div>
  );
};
