"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AccountDetails } from "@mr/lib/types/accounts";

export const useAccountsColumns = (data: AccountDetails[]) => {
  const [accountsColumns, setAccountsColumns] = useState<ColumnDef<AccountDetails>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<AccountDetails>[] = [
      {
        accessorKey: "accountNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account #" />,
        cell: ({ row }) => <span>{row.original.accountNumber}</span>,
        meta: { exportLabel: "Account Number" },
      },
      {
        accessorKey: "accountName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account Name" />,
        cell: ({ row }) => <span>{row.original.accountName}</span>,
        meta: { exportLabel: "Account Name" },
      },
      {
        accessorKey: "meterReader.name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Meter Reader" />,
        cell: ({ row }) => <span>{row.original.meterReader.name}</span>,
        meta: { exportLabel: "Meter Reader" },
      },
      {
        accessorKey: "previousReading",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Previous" />,
        cell: ({ row }) => <span>{row.original.previousReading}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "currentReading",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Current" />,
        cell: ({ row }) => <span>{row.original.currentReading}</span>,
        enableColumnFilter: false,
      },
      {
        id: "consumption",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Consumption" />,
        cell: ({ row }) => (
          <span>
            {row.original.currentReading ? row.original.currentReading - row.original.previousReading : "—"}
          </span>
        ),
        enableColumnFilter: false,
      },
    ];

    setAccountsColumns(cols);
  }, [data]);

  return accountsColumns;
};
