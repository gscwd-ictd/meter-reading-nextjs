import { Badge } from "@/components/ui/Badge";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { BatchPost, BatchPostStatus } from "@/lib/types/batch-post";
import { format } from "date-fns";

type ViewMeterReadingDetailsProps = {
  data: BatchPost | null;
};

export default function ViewMeterReadingDetails({ data }: ViewMeterReadingDetailsProps) {
  return (
    <>
      {data ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Meter Reading Details</DialogTitle>
            <div className="m-2 flex flex-col gap-4">
              <div className="p-1">
                <div className="flex flex-row justify-between">
                  <h3 className="text-gray-600">Account Number: </h3>
                  <h3 className="font-semibold">{data.accountNo}</h3>
                </div>
                <div className="flex flex-row justify-between">
                  <h3 className="text-gray-600">Account Name: </h3>
                  <h3 className="font-semibold">{data.accountName}</h3>
                </div>
              </div>
              <Table className="border-1 border-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>
                      {data.status === BatchPostStatus.POSTED ? (
                        <Badge variant={"default"} className="w-20">
                          Posted
                        </Badge>
                      ) : (
                        <Badge variant={"outline"} className="w-20">
                          Not Posted
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reading Date</TableCell>
                    <TableCell>{format(data.readingDate, "MMMM dd, yyyy | HH:mm a")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Billed Amount</TableCell>
                    <TableCell>₱ {data.billedAmount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Due Date</TableCell>
                    <TableCell>{format(data.dueDate, "MMMM dd, yyyy")}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Disconnection Date</TableCell>
                    <TableCell>{format(data.disconnectionDate, "MMMM dd, yyyy")}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </DialogHeader>
        </DialogContent>
      ) : null}
    </>
  );
}
