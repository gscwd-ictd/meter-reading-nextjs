"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import {
  TextMessageData as TextBlastReportColumn,
  TextMessageStatus,
} from "@mr/lib/types/text-blast/TextMessage";
import { Badge } from "@mr/components/ui/Badge";
import { format } from "date-fns";

export const useTextBlastReportColumns = () => {
  return [
    {
      accessorKey: "dateCreated",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Reference Date" />,
      cell: ({ row }) => {
        const dateCreated = row.original.dateCreated;
        return format(dateCreated, "yyyy-MM-dd");
      },
      enableColumnFilter: true,
      filterFn: "dateBetween" as FilterFnOption<TextBlastReportColumn>,
    },
    {
      accessorKey: "accountNumber",
      header: "Account No.",
      cell: ({ row }) => <span>{row.original.accountNumber}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "consumerName",
      header: "Account Name",
      cell: ({ row }) => <span>{row.original.consumerName}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "status",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const status = row.getValue("status");
        return status === TextMessageStatus.SENT ? (
          <Badge variant={"default"} className="w-20 bg-green-800">
            Sent
          </Badge>
        ) : (
          <Badge variant={"destructive"} className="w-20">
            Failed
          </Badge>
        );
      },
      enableColumnFilter: false,
    },
    {
      accessorKey: "contactNumber",
      header: "Contact No.",
      cell: ({ row }) => <span>{row.original.contactNumber}</span>,
      enableColumnFilter: false,
    },
    {
      accessorKey: "message",
      header: "Message",
      cell: ({ row }) => {
        const message = row.original.message;
        const maxLength = 85;

        return (
          <span title={message}>
            {message && message.length > maxLength ? `${message.substring(0, maxLength)}...` : message}
          </span>
        );
      },
      enableColumnFilter: false,
    },
  ] satisfies ColumnDef<TextBlastReportColumn>[];
};
