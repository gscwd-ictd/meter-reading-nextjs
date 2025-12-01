import { DashboardCard } from "@mr/components/ui/cards/DashboardCard";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { ClockIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";

const mockReadingWithRemarks: Array<Omit<WithRemarksAccount, "billedAmount" | "usage">> = [
  { accountNo: "457487545", zone: "1", book: "62", name: "Elizabeth Lopez", remarks: "PE Leak Before Meter" },
  { accountNo: "524878444", zone: "2", book: "1", name: "John Doe", remarks: "Stuck-up Meter" },
  { accountNo: "225487325", zone: "6", book: "5", name: "Aleena Fischer", remarks: "Tilted Meter" },
];

export const WithRemarksProgressCard: FunctionComponent = () => {
  const router = useRouter();

  return (
    <DashboardCard
      size="sm"
      className="col-span-2 flex min-h-0 flex-col border bg-white sm:col-span-3 md:col-span-3 lg:col-span-2 dark:bg-gray-900"
      onButtonClick={() => router.push("/progress/zonebooks?type=with-remarks")}
      title="Reading Activity"
      subtitle="With remarks"
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
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-xs font-semibold text-gray-800 dark:text-white">
                          {reading.accountNo}
                        </span>
                        <span className="text-lg text-green-600">•</span>
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          {reading.name}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">{reading.remarks}</div>
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
  );
};
