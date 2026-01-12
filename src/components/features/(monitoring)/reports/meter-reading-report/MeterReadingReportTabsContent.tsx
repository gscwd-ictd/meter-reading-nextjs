import { TabsContent } from "@mr/components/ui/Tabs";
import { BilledTabReport } from "./billed/BilledTabReport";
import { UnBilledTabReport } from "./unbilled/UnbilledTabReport";
import { WithRemarksTabReport } from "./with-remarks/WithRemarksTabReport";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@mr/components/ui/Empty";
import { CircleGaugeIcon } from "lucide-react";

export const MeterReadingReportTabsContent = () => {
  return (
    <>
      {/* Billed Tab */}

      <BilledTabReport />

      {/* Unbilled Tab */}
      <UnBilledTabReport />

      {/* With Remarks Tab */}
      <WithRemarksTabReport />

      {/* New Meters Tab */}
      <TabsContent value="new-meters" className="mt-0 flex-1">
        <div className="flex h-full flex-col items-center justify-center rounded-md border bg-gray-50 p-6">
          <Empty className="h-auto">
            <EmptyHeader className="text-center">
              <EmptyMedia variant="icon">
                <CircleGaugeIcon className="h-12 w-12 text-gray-400" />
              </EmptyMedia>
              <EmptyTitle className="mt-4 text-lg font-semibold">New Meters</EmptyTitle>
              <EmptyDescription className="mt-0">
                No new meters found for the selected criteria
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-0">
              <p className="text-xs text-gray-500">No new meter installations in the selected period</p>
            </EmptyContent>
          </Empty>
        </div>
      </TabsContent>
    </>
  );
};
