import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { Progress } from "@mr/components/ui/Progress";
import { format } from "date-fns";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";

type MonthlyProgressCardProps = {
  isBlank?: boolean;
};

export const MonthlyProgressCard: FunctionComponent<MonthlyProgressCardProps> = ({ isBlank }) => {
  const router = useRouter();
  if (isBlank) {
    return (
      <DashboardCard
        size="sm"
        className="col-span-3 border bg-white dark:bg-gray-900"
        title="This Month's Progress"
        subtitle={`${format(new Date(), "MMMM yyyy")}`}
        // No onButtonClick when blank
      >
        <div className="space-y-3 opacity-50">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress </span>
            <span className="font-medium">0%</span>
          </div>
          <Progress value={0} />
          <div className="flex justify-between text-sm text-gray-500">
            <span>0 of 0 completed</span>
            <span>0 remaining</span>
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      size="sm"
      className="col-span-3 border bg-white dark:bg-gray-900"
      onButtonClick={() => router.push("/progress/zonebooks")}
      title="This Month's Progress"
      subtitle={`${format(new Date(), "MMMM yyyy")}`}
    >
      {/* <div className="mb-2 text-base font-medium">Monthly Progress</div> */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Progress </span>
          <span className="font-medium">{Math.round((1500 / 2500) * 100)}%</span>
        </div>
        <Progress value={(1500 / 2500) * 100} />
        <div className="flex justify-between text-sm text-gray-500">
          <span>1500 of 2500 completed</span>
          <span>{2500 - 1500} remaining</span>
        </div>
      </div>
    </DashboardCard>
  );
};
