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
import { UnbilledAccount } from "@mr/lib/types/accounts";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent } from "react";

type TabReportProps = {
  data: UnbilledAccount[] | undefined;
  isLoading: boolean;
};

export const UnBilledTabReport: FunctionComponent<TabReportProps> = ({ data, isLoading }) => {
  return (
    <>
      <TabsContent
        value="unbilled"
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((account, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{account.accountNumber}</TableCell>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>{account.zone}</TableCell>
                      <TableCell>{account.book}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Separate footer div */}
            <div className="mt-4 border-t bg-gray-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Unbilled accounts count:</span>
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
              <EmptyTitle className="mt-4 text-lg font-semibold">No Unbilled Accounts</EmptyTitle>
              <EmptyDescription className="mt-0">
                No unbilled accounts match your current filters
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
