"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TextMessage as TextBlastReportColumn } from "@mr/lib/types/text-message";
import { CircleCheckBig, CircleOff } from "lucide-react";
import { format } from "date-fns";

export const useTextBlastReportColumns = (data: TextBlastReportColumn[] | undefined) => {
  const [textBlastReportColumns, setTextBlastReportColumns] = useState<ColumnDef<TextBlastReportColumn>[]>(
    []
  );

  useEffect(() => {
    const cols: ColumnDef<TextBlastReportColumn>[] = [
      {
        accessorKey: "dateSent",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reference Date" />,
        cell: ({ row }) => <span>{format(row.original.dateSent, "yyyy-mm-dd")}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "accountNo",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account No." />,
        cell: ({ row }) => <span>{row.original.accountNo}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "concessionaireName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Concessionaire Name" />,
        cell: ({ row }) => <span>{row.original.concessionaireName}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "sent",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {row.original.sent ? (
              <>
                <CircleCheckBig className="text-green-800" size={14} />
                <span className="text-green-800 font-semibold">Sent</span>
              </>
            ) : (
              <>
                <CircleOff className="text-red-800" size={14} />
                <span className="text-red-800 font-semibold">Failed</span>
              </>
            )}
          </div>
        ),
        enableColumnFilter: false,
      },
      {
        accessorKey: "primaryContactNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No." />,
        cell: ({ row }) => <span>{row.original.primaryContactNumber}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "message",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Message" />,
        cell: ({ row }) => <span>{row.original.message || "N/A"}</span>,
        enableColumnFilter: false,
      },
    ];

    setTextBlastReportColumns(cols);
  }, [data]);

  return textBlastReportColumns;
};
