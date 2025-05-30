"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TextMessage as NotSentMessageColumn } from "@mr/lib/types/text-message";
import { Checkbox } from "@mr/components/ui/Checkbox";

export const useNotSentMessageColumns = (data: NotSentMessageColumn[] | undefined) => {
  const [messageColumns, setMessageColumns] = useState<ColumnDef<NotSentMessageColumn>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<NotSentMessageColumn>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
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
    ];

    setMessageColumns(cols);
  }, [data]);

  return messageColumns;
};
