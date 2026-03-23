"use client";

import { formatToPHP } from "@mr/lib/functions/formatNumberToCurrency";
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
        accessorKey: "meterReader.id",
        cell: (column) => <span>{column.row.original.meterReader.name}</span>,
        header: "Meter Reader",
        enableColumnFilter: true,
      },
      // {
      //   accessorKey: "accountName",
      //   cell: (column) => <span>{column.row.original.accountName}</span>,
      //   header: "Account Name",
      //   enableColumnFilter: true,
      // },
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
        accessorKey: "usage",
        cell: (column) => <span>{column.row.original.usage}</span>,
        header: "Usage",
      },
      {
        accessorKey: "billedAmount",
        cell: (column) => (
          <span>{column.row.original.billedAmount ? formatToPHP(column.row.original.billedAmount) : ""}</span>
        ),
        header: "Billed Amount",
      },
    ];

    setBilledAccounts(cols);
  }, [data]);

  return billedAccounts;
};
