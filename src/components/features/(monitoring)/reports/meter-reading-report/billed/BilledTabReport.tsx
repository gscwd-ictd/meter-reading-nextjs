import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
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
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReceiptTextIcon } from "lucide-react";
import { FunctionComponent, useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const BilledTabReport: FunctionComponent = () => {
  const { isSubmitted, setFetchStatus } = useMeterReadingReportContext();
  const form = useFormContext();
  const { watch } = form;

  const yearMonth = watch("yearMonth");
  const meterReaderId = watch("meterReader.id");

  const { data, fetchStatus } = useQuery({
    queryKey: ["get-billed-report", yearMonth],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/summary/billed`, {
        params: {
          monthYear: yearMonth,
          zone: "",
          book: "",
          meterReaderId: meterReaderId ? meterReaderId : "",
        },
      });

      console.log(res);
      return res.data as BilledAccount[];
    },
    enabled: isSubmitted,
  });

  const totalBilledAmount = useMemo(() => {
    return data && data.reduce((sum, account) => sum + account.amount, 0);
  }, [data]);

  useEffect(() => {
    setFetchStatus(fetchStatus);
  }, [fetchStatus]);

  return (
    <TabsContent
      value="billed"
      className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6"
    >
      {data ? (
        <div className="flex h-full w-full flex-col">
          {/* Table with scrollable body */}
          <div className="flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] dark:text-black">Account No</TableHead>
                  <TableHead className="w-[200px] dark:text-black">Name</TableHead>
                  <TableHead className="dark:text-black">Zone</TableHead>
                  <TableHead className="dark:text-black">Book</TableHead>
                  <TableHead className="dark:text-black">Usage</TableHead>
                  <TableHead className="text-right dark:text-black">Billed Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((account, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium dark:text-black">{account.accountNumber}</TableCell>
                      <TableCell className="dark:text-black">Account Name Here</TableCell>
                      <TableCell className="dark:text-black">{account.zone}</TableCell>
                      <TableCell className="dark:text-black">{account.book}</TableCell>
                      <TableCell className="dark:text-black">{account.usage}</TableCell>
                      <TableCell className="text-right dark:text-black">
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
        <Empty>
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
