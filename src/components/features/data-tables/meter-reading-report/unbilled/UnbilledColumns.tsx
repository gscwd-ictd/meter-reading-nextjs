"use client";

import { formatToPHP } from "@mr/lib/functions/formatNumberToCurrency";
import { UnbilledAccount } from "@mr/lib/types/accounts";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useUnbilledColumns = (data: UnbilledAccount[]) => {
  const [unbilledAccounts, setUnbilledAccounts] = useState<ColumnDef<UnbilledAccount>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<UnbilledAccount>[] = [
      {
        accessorKey: "accountNumber",
        cell: (column) => <span>{column.row.original.accountNumber}</span>,
        header: "Account No",
        enableColumnFilter: true,
      },
      {
        accessorKey: "accountName",
        cell: (column) => <span>{column.row.original.accountName}</span>,
        header: "Account Name",
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
    ];

    setUnbilledAccounts(cols);
  }, [data]);

  return unbilledAccounts;
};
