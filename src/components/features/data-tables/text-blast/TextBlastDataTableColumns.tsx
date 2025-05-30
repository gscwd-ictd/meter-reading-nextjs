
"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TextMessage as TextBlastColumn } from "@mr/lib/types/text-message";

export const useTextBlastColumns = (data: TextBlastColumn[] | undefined) => {
  const [textBlastColumns, setTextBlastColumns] = useState<ColumnDef<TextBlastColumn>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<TextBlastColumn>[] = [
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
        accessorKey: "primaryContactNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No. 1" />,
        cell: ({ row }) => <span>{row.original.primaryContactNumber}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "secondaryContactNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No. 2" />,
        cell: ({ row }) => <span>{row.original.secondaryContactNumber || "N/A"}</span>,
        enableColumnFilter: false,
      },
    ];

    setTextBlastColumns(cols);
  }, [data]);

  return textBlastColumns;
};
