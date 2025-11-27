import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { BilledAccount } from "@mr/lib/types/accounts";
import { FunctionComponent } from "react";

const mockData: BilledAccount[] = [
  {
    accountNo: "4287159",
    billedAmount: 20198.57,
    usage: 52,
    book: "2",
    zone: "1",
    name: "Sample Account 1",
  },
  {
    accountNo: "1638492",
    billedAmount: 5111.0,
    usage: 24,
    book: "3",
    zone: "1",
    name: "Sample Account 2",
  },
  {
    accountNo: "7952031",
    billedAmount: 6987.45,
    usage: 28,
    book: "4",
    zone: "1",
    name: "Sample Account 3",
  },
  {
    accountNo: "5319864",
    billedAmount: 1055.86,
    usage: 10,
    book: "21",
    zone: "1",
    name: "Sample Account 4",
  },
  {
    accountNo: "2476105",
    billedAmount: 1055.86,
    usage: 10,
    book: "21",
    zone: "1",
    name: "Sample Account 5",
  },
  {
    accountNo: "8693278",
    billedAmount: 1055.86,
    usage: 10,
    book: "21",
    zone: "1",
    name: "Sample Account 6",
  },
  {
    accountNo: "6145783",
    billedAmount: 1055.86,
    usage: 10,
    book: "21",
    zone: "1",
    name: "Sample Account 7",
  },
  {
    accountNo: "3921467",
    billedAmount: 1055.86,
    usage: 10,
    book: "21",
    zone: "1",
    name: "Sample Account 8",
  },
  {
    accountNo: "7580921",
    billedAmount: 1055.86,
    usage: 10,
    book: "21",
    zone: "1",
    name: "Sample Account 9",
  },
];

export const BilledTabReport: FunctionComponent = () => {
  const totalBilledAmount = mockData.reduce((sum, account) => sum + account.billedAmount, 0);

  return (
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
              <TableHead className="text-right">Billed Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((account) => (
              <TableRow key={account.accountNo}>
                <TableCell className="font-medium">{account.accountNo}</TableCell>
                <TableCell>{account.name}</TableCell>
                <TableCell>{account.zone}</TableCell>
                <TableCell>{account.book}</TableCell>
                <TableCell>{account.usage}</TableCell>
                <TableCell className="text-right">
                  ₱{" "}
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
            {totalBilledAmount.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </div>
  );
};
