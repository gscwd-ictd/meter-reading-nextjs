"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TextMessage as MessageColumn } from "@mr/lib/types/text-message";

export const useMessageColumns = (data: MessageColumn[] | undefined) => {
  const [messageColumns, setMessageColumns] = useState<ColumnDef<MessageColumn>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<MessageColumn>[] = [
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
