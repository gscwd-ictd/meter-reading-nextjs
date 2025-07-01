"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { TextMessage as SentMessageColumn } from "@/lib/types/text-message";

export const useSentMessageColumns = (data: SentMessageColumn[] | undefined) => {
  const [sentMessageColumns, setSentMessageColumns] = useState<ColumnDef<SentMessageColumn>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<SentMessageColumn>[] = [
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

    setSentMessageColumns(cols);
  }, [data]);

  return sentMessageColumns;
};
