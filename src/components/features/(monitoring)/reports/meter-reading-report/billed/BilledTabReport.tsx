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
        <div className="flex h-full w-full flex-col">
          {/* Table with scrollable body */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Account No</TableHead>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="">Zone</TableHead>
                  <TableHead className="">Book</TableHead>
                  <TableHead className="">Usage</TableHead>
                  <TableHead className="text-right">Billed Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((account, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{account.accountNumber}</TableCell>
                      <TableCell className="">Account Name Here</TableCell>
                      <TableCell className="">{account.zone}</TableCell>
                      <TableCell className="">{account.book}</TableCell>
                      <TableCell className="">{account.usage}</TableCell>
                      <TableCell className="text-right">
                        ₱{" "}
                        {account &&
                          account.amount &&
                          account.amount.toLocaleString("en-US", {
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
          <div className="mt-4 border-t bg-gray-50 px-4 py-3 dark:bg-gray-700">
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
