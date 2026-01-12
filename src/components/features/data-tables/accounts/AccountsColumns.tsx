"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AccountDetails } from "@mr/lib/types/accounts";
import { Badge } from "@mr/components/ui/Badge";
import { formatDate } from "date-fns";

export const useAccountsColumns = (data: AccountDetails[]) => {
  const [accountsColumns, setAccountsColumns] = useState<ColumnDef<AccountDetails>[]>([]);

  const filterFn: FilterFn<AccountDetails> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<AccountDetails>[] = [
      {
        accessorKey: "accountNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account #" />,
        cell: ({ row }) => <span className="text-sm">{row.original.accountNumber}</span>,
        meta: { exportLabel: "Account Number" },
        filterFn: filterFn,
      },
      {
        accessorKey: "accountName",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Account Name" />,
        cell: ({ row }) => (
          <span className="text-sm">{row.original.accountName}</span>
          // className="flex max-w-[15%] items-start text-start"
        ),
        filterFn: filterFn,
        meta: { exportLabel: "Account Name" },
      },
      {
        accessorKey: "previousReading",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Previous" />,
        cell: ({ row }) => <span className="text-sm">{row.original.previousReading}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "currentReading",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Current" />,
        cell: ({ row }) => <span className="text-sm">{row.original.currentReading}</span>,
        enableColumnFilter: false,
      },
      {
        id: "consumption",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Consumption" />,
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.currentReading ? row.original.currentReading - row.original.previousReading : "—"}
          </span>
        ),
        enableColumnFilter: false,
      },
      {
        accessorKey: "readingDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reading Date" />,
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.readingDate ? formatDate(row.original.readingDate, "MMM d, yyyy hh:mm aa") : "—"}
          </span>
        ),
        meta: { exportLabel: "Reading Date" },
        enableColumnFilter: false,
      },
      {
        accessorKey: "remarks",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
        cell: ({ row }) => <span className="text-sm">{row.original.remarks}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "isRead",
        accessorFn: (row) => (row.isRead === true ? "Read" : "Unread"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
        cell: ({ row }) => (
          <Badge
            className={`flex w-[4rem] justify-center text-sm ${row.original.isRead ? "bg-green-500" : "bg-gray-400"}`}
          >
            {row.original.isRead ? "Read" : "Unread"}
          </Badge>
        ),
        enableColumnFilter: true,
        filterFn: filterFn,
        meta: { exportLabel: "Status" },
      },
    ];

    setAccountsColumns(cols);
  }, [data]);

  return accountsColumns;
};
