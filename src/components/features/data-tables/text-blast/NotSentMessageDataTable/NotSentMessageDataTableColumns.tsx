"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TextMessage as NotSentMessageColumn } from "@/lib/types/text-message";

export const useNotSentMessageColumns = (data: NotSentMessageColumn[] | undefined) => {
  const [notSentMessageColumns, setNotSentMessageColumns] = useState<ColumnDef<NotSentMessageColumn>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<NotSentMessageColumn>[] = [
      {
        accessorKey: "accountNo",
        header: "Account No.",
        cell: ({ row }) => <span>{row.original.accountNo}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "concessionaireName",
        header: "Concessionaire Name",
        cell: ({ row }) => <span>{row.original.concessionaireName}</span>,
        enableColumnFilter: false,
      },
    ];

    setNotSentMessageColumns(cols);
  }, [data]);

  return notSentMessageColumns;
};
