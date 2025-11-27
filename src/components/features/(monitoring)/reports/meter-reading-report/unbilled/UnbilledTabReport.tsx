import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { UnbilledAccount } from "@mr/lib/types/accounts";
import { FunctionComponent } from "react";

const mockData: UnbilledAccount[] = [
  {
    accountNo: "3684921",
    book: "2",
    zone: "1",
    name: "Sample Account 1",
  },
  {
    accountNo: "7145836",
    book: "3",
    zone: "1",
    name: "Sample Account 2",
  },
  {
    accountNo: "2957304",
    book: "4",
    zone: "1",
    name: "Sample Account 3",
  },
  {
    accountNo: "8471629",
    book: "21",
    zone: "1",
    name: "Sample Account 4",
  },
  {
    accountNo: "5309187",
    book: "21",
    zone: "1",
    name: "Sample Account 5",
  },
  {
    accountNo: "1627493",
    book: "21",
    zone: "1",
    name: "Sample Account 6",
  },
  {
    accountNo: "4850276",
    book: "21",
    zone: "1",
    name: "Sample Account 7",
  },
  {
    accountNo: "7391854",
    book: "21",
    zone: "1",
    name: "Sample Account 8",
  },
  {
    accountNo: "2068475",
    book: "21",
    zone: "1",
    name: "Sample Account 9",
  },
  {
    accountNo: "5917362",
    book: "21",
    zone: "1",
    name: "Sample Account 10",
  },
];

export const UnBilledTabReport: FunctionComponent = () => {
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((account) => (
              <TableRow key={account.accountNo}>
                <TableCell className="font-medium">{account.accountNo}</TableCell>
                <TableCell>{account.name}</TableCell>
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
          <span className="text-right font-bold underline underline-offset-2">{mockData.length}</span>
        </div>
      </div>
    </div>
  );
};
