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
          <div className="flex h-full w-full flex-col">
            {/* Table with scrollable body */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Account No</TableHead>
                    <TableHead className="w-[200px]">Name</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Book</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Remarks</TableHead>
                    <TableHead className="text-right">Billed Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data &&
                    data.map((account) => (
                      <TableRow key={account.accountNumber}>
                        <TableCell className="font-medium">{account.accountNumber}</TableCell>
                        <TableCell>{account.accountName}</TableCell>
                        <TableCell>{account.zone}</TableCell>
                        <TableCell>{account.book}</TableCell>
                        <TableCell>{account.usage}</TableCell>
                        <TableCell className="italic">{account.remarks}</TableCell>
                        <TableCell className="text-right">
                          {account.billedAmount && ` ₱`}
                          {account.billedAmount.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            {/* Separate footer div - NOT using TableFooter */}
            <div className="mt-4 border-t bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Billed Amount:</span>
                <span className="text-right font-bold underline underline-offset-2">
                  ₱{" "}
                  {totalBilledAmount &&
                    totalBilledAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </span>
              </div>
            </div>
          </div>
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
