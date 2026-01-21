"use client";

import { BilledAccount } from "@mr/lib/types/accounts";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useBilledColumns = (data: BilledAccount[]) => {
  const [billedAccounts, setBilledAccounts] = useState<ColumnDef<BilledAccount>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<BilledAccount>[] = [
      {
        accessorKey: "accountNumber",
        cell: (column) => <span>{column.row.original.accountNumber}</span>,
        header: "Account No",
        enableColumnFilter: true,
      },
      {
        accessorKey: "zone",
        cell: (column) => <span>{column.row.original.zone}</span>,
        header: "Zone",
        enableColumnFilter: true,
      },
      {
        accessorKey: "book",
        cell: (column) => <span>{column.row.original.book}</span>,
        header: "Book",
        enableColumnFilter: true,
      },
      {
        accessorKey: "amount",
        cell: (column) => <span >{column.row.original.amount}</span>,
        header: "Billed Amount",
      },
    ];

    setBilledAccounts(cols);
  }, [data]);

  return billedAccounts;
};
