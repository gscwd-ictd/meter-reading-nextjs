// @ts-nocheck
import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { ClockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";

type WithRemarksProgressCardProps = {
  isBlank?: boolean;
};

export const WithRemarksProgressCard: FunctionComponent<WithRemarksProgressCardProps> = ({
  isBlank = false,
}) => {
  const router = useRouter();

  if (isBlank) {
    return (
      <DashboardCard
        size="sm"
        className="col-span-2 flex min-h-0 flex-col border bg-white sm:col-span-3 md:col-span-3 lg:col-span-2 dark:bg-gray-900"
        title="Reading Activity"
        subtitle="With remarks"
      >
        <div className="flex h-[10rem] flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-muted-foreground/60 text-xs">Remarks tracking will appear here</p>
          </div>
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      size="sm"
      className="col-span-2 flex min-h-0 flex-col border bg-white sm:col-span-3 md:col-span-3 lg:col-span-2 dark:bg-gray-900"
      onButtonClick={() => router.push("/progress/zonebooks?type=with-remarks")}
      title="Reading Activity"
      subtitle="With remarks"
    >
      <div className="flex h-[10rem] flex-1 flex-col overflow-hidden">
        <div className="overflow-y-auto">
          <div className="flex flex-col gap-2">
            {mockReadingWithRemarks.map((reading) => (
              <div
                key={reading.accountNumber}
                className="rounded-lg border border-gray-200/60 bg-gray-50/50 p-3 transition-colors hover:bg-gray-100/50 dark:border-gray-700 dark:bg-gray-800/50 dark:hover:bg-gray-800"
              >
                {/* ... your existing content ... */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardCard>
  );
};
