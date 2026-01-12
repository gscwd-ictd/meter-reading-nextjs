import { useMeterReadingReportContext } from "@mr/components/providers/MeterReadingReportProvider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { TabsContent } from "@mr/components/ui/Tabs";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FunctionComponent, useMemo } from "react";
import { useFormContext } from "react-hook-form";

export const WithRemarksTabReport: FunctionComponent = () => {
  const form = useFormContext();
  const { watch } = form;

  const yearMonth = watch("yearMonth");
  const meterReaderId = watch("meterReaderId");

  const { isSubmitted } = useMeterReadingReportContext();

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
      return res.data as WithRemarksAccount[];
    },
    enabled: isSubmitted,
  });

  const totalBilledAmount = useMemo(() => {
    return data && data.reduce((sum, account) => sum + account.amount, 0);
  }, [data]);

  return (
    <>
      <TabsContent
        value="with-remarks"
        className="flex h-full flex-col items-start justify-center rounded-md border bg-gray-50 p-6"
      >
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
                        ₱{" "}
                        {account.amount.toLocaleString("en-US", {
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
      </TabsContent>
    </>
  );
};
