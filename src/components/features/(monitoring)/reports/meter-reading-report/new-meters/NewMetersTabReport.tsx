import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@mr/components/ui/Empty";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { TabsContent } from "@mr/components/ui/Tabs";
import { NewMeterAccount } from "@mr/lib/types/accounts";
import { format } from "date-fns";
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
          <div className="flex h-full w-full flex-col">
            {/* Table with scrollable body */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Meter No</TableHead>
                    <TableHead className="w-[200px]">Current Reading</TableHead>
                    <TableHead>Date Time</TableHead>
                    <TableHead>Meter Reader</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.map((account) => (
                      <TableRow key={account.meterNumber}>
                        <TableCell>{account.meterNumber}</TableCell>
                        <TableCell>{account.currentReading}</TableCell>
                        <TableCell>
                          {account.dateTime ? format(account.dateTime, "MMM dd, yyyy hh:mm:a") : ""}
                        </TableCell>

                        <TableCell>{account.meterReader ? account.meterReader.name : "-"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Separate footer div */}
            <div className="mt-4 border-t bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">New meters count:</span>
                <span className="text-right font-bold underline underline-offset-2">{data.length}</span>
              </div>
            </div>
          </div>
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
