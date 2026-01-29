import { NewMetersDataTable } from "@mr/components/features/data-tables/meter-reading-report/new-meters/NewMetersDataTable";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@mr/components/ui/Empty";
import { TabsContent } from "@mr/components/ui/Tabs";
import { NewMeterAccount } from "@mr/lib/types/accounts";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent } from "react";

type TabReportProps = {
  data: NewMeterAccount[] | undefined;
  isLoading: boolean;
};

export const NewMetersTabReport: FunctionComponent<TabReportProps> = ({ data, isLoading }) => {
  return (
    <>
      <TabsContent
        value="new-meters"
        className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6 dark:bg-gray-900"
      >
        {data && data.length > 0 && !isLoading ? (
          <NewMetersDataTable
            data={data}
            header={
              <div className="flex w-full items-center justify-end gap-2 text-right">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">New meters count:</span>
                  <span className="text-right font-bold underline underline-offset-2">{data.length}</span>
                </div>
              </div>
            }
          />
        ) : (
          <Empty className="flex h-full w-full">
            <EmptyHeader className="text-center">
              <EmptyMedia variant="icon">
                <ReceiptTextIcon className="h-12 w-12 text-gray-400" />
              </EmptyMedia>
              <EmptyTitle className="mt-4 text-lg font-semibold">New meters</EmptyTitle>
              <EmptyDescription className="mt-0">No new meters match your current filters</EmptyDescription>
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
