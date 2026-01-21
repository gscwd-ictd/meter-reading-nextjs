import { BilledDataTable } from "@mr/components/features/data-tables/meter-reading-report/billed/BilledDataTable";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@mr/components/ui/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { TabsContent } from "@mr/components/ui/Tabs";
import { BilledAccount } from "@mr/lib/types/accounts";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent, useMemo } from "react";

type TabReportProps = {
  data: BilledAccount[] | undefined;
  isLoading: boolean;
};

export const BilledTabReport: FunctionComponent<TabReportProps> = ({ data, isLoading }) => {
  const totalBilledAmount = useMemo(() => {
    return data && data.reduce((sum, account) => sum + account.amount, 0);
  }, [data]);

  return (
    <TabsContent
      value="billed"
      className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6 dark:bg-gray-900"
    >
      {data && data.length > 0 && !isLoading ? (
        <BilledDataTable
          data={data}
          header={
            <div className="flex w-full items-center justify-end gap-2 text-right">
              <span className="font-normal">Total: </span>
              <span className="font-medium">{totalBilledAmount}</span>
            </div>
          }
        />
      ) : (
        <Empty className="flex h-full w-full">
          <EmptyHeader className="text-center">
            <EmptyMedia variant="icon">
              <ReceiptTextIcon className="h-12 w-12 text-gray-400" />
            </EmptyMedia>
            <EmptyTitle className="mt-4 text-lg font-semibold">No Billed Accounts</EmptyTitle>
            <EmptyDescription className="mt-0">
              No billed accounts match your current filters
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="mt-0">
            <p className="text-xs text-gray-500">Try adjusting your date range or meter reader selection</p>
          </EmptyContent>
        </Empty>
      )}
    </TabsContent>
  );
};
