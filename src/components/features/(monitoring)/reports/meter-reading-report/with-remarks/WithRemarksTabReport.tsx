import { WithRemarksDataTable } from "@mr/components/features/data-tables/meter-reading-report/with-remarks/WithRemarksDataTable";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@mr/components/ui/Empty";
import { TabsContent } from "@mr/components/ui/Tabs";
import { formatToPHP } from "@mr/lib/functions/formatNumberToCurrency";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent, useMemo } from "react";

type TabReportProps = {
  data: WithRemarksAccount[] | undefined;
  isLoading: boolean;
};

export const WithRemarksTabReport: FunctionComponent<TabReportProps> = ({ data, isLoading }) => {
  const totalBilledAmount = useMemo(() => {
    return data && data.reduce((sum, account) => sum + account.billedAmount, 0);
  }, [data]);

  return (
    <>
      <TabsContent
        value="with-remarks"
        className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6 dark:bg-gray-900"
      >
        {data && data.length > 0 && !isLoading ? (
          <WithRemarksDataTable
            data={data}
            header={
              <div className="flex w-full items-center justify-end gap-2 text-right">
                <span className="font-normal">Total: </span>
                <span className="font-medium">{totalBilledAmount ? formatToPHP(totalBilledAmount) : ""}</span>
              </div>
            }
          />
        ) : (
          <Empty className="flex h-full w-full">
            <EmptyHeader className="text-center">
              <EmptyMedia variant="icon">
                <ReceiptTextIcon className="h-12 w-12 text-gray-400" />
              </EmptyMedia>
              <EmptyTitle className="mt-4 text-lg font-semibold">No Accounts with Remarks</EmptyTitle>
              <EmptyDescription className="mt-0">
                No accounts with remarks match your current filters
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-0">
              <p className="text-xs text-gray-500">Try adjusting your date range or meter reader selection</p>
            </EmptyContent>
          </Empty>
        )}
      </TabsContent>
    </>
  );
};
