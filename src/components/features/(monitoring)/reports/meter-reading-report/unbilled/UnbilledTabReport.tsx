import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { TabsContent } from "@mr/components/ui/Tabs";
import { UnbilledAccount } from "@mr/lib/types/accounts";
import { FunctionComponent } from "react";

const mockData: UnbilledAccount[] = [
  {
    accountNumber: "3684921",
    book: "2",
    zone: "1",
    accountName: "Sample Account 1",
  },
  {
    accountNumber: "7145836",
    book: "3",
    zone: "1",
    accountName: "Sample Account 2",
  },
  {
    accountNumber: "2957304",
    book: "4",
    zone: "1",
    accountName: "Sample Account 3",
  },
  {
    accountNumber: "8471629",
    book: "21",
    zone: "1",
    accountName: "Sample Account 4",
  },
  {
    accountNumber: "5309187",
    book: "21",
    zone: "1",
    accountName: "Sample Account 5",
  },
  {
    accountNumber: "1627493",
    book: "21",
    zone: "1",
    accountName: "Sample Account 6",
  },
  {
    accountNumber: "4850276",
    book: "21",
    zone: "1",
    accountName: "Sample Account 7",
  },
  {
    accountNumber: "7391854",
    book: "21",
    zone: "1",
    accountName: "Sample Account 8",
  },
  {
    accountNumber: "2068475",
    book: "21",
    zone: "1",
    accountName: "Sample Account 9",
  },
  {
    accountNumber: "5917362",
    book: "21",
    zone: "1",
    accountName: "Sample Account 10",
  },
];

export const UnBilledTabReport: FunctionComponent = () => {
  return (
    <>
      <TabsContent
        value="unbilled"
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.map((account, idx) => (
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
              <span className="text-right font-bold underline underline-offset-2">{mockData.length}</span>
            </div>
          </div>
        </div>
      </TabsContent>
    </>
  );
};
