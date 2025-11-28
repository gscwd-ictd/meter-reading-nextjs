import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { CircleGaugeIcon } from "lucide-react";
import { FunctionComponent } from "react";

export const NewMetersCard: FunctionComponent = () => {
  // useQuery function here

  return (
    <DashboardCard
      title="New Meters"
      // className="border bg-sky-200/90 dark:bg-gray-900"
      className="border bg-white/50 dark:bg-gray-900"
      icon={
        <CircleGaugeIcon className="dark:text-primary text-primary size-8 sm:size-6 md:size-6 lg:size-8" />
        // text-sky-400
      }
    >
      <div className="dark:text-primary text-4xl font-bold text-gray-800">5</div>
      <div className="text-sm text-gray-500">New meters for the month</div>
    </DashboardCard>
  );
};
