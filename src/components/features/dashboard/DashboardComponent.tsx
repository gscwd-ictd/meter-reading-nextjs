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
          className="border-0 bg-sky-50"
          icon={<ReceiptTextIcon className="text-sky-600" />}
        >
          <div className="text-4xl font-bold">1500</div>
          <div className="text-sm text-gray-500">Billed for the month</div>
        </DashboardCard>

        <DashboardCard
          title="Unbilled"
          className="border-0 bg-gray-50"
          icon={<SendIcon className="text-gray-600" />}
        >
          <div className="text-4xl font-bold">1000</div>
          <div className="text-sm text-gray-500">Unbilled for the month</div>
        </DashboardCard>

        <DashboardCard
          title="With Remarks"
          className="border-0 bg-sky-50"
          icon={<TextQuoteIcon className="text-sky-600" />}
        >
          <div className="text-4xl font-bold">58</div>
          <div className="text-sm text-gray-500">With remarks for the month</div>
        </DashboardCard>

        <DashboardCard
          title="New Meter"
          className="border-0 bg-gray-50"
          icon={<CircleGaugeIcon className="text-gray-600" />}
        >
          <div className="text-4xl font-bold">5</div>
          <div className="text-sm text-gray-500">New meters for the month</div>
        </DashboardCard>
      </div>
    </div>
  );
};
