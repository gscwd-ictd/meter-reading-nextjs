"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AccountDetails } from "@mr/lib/types/accounts";
import { formatDate } from "date-fns";
import { CheckCircleIcon, XCircleIcon } from "lucide-react";

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
      // {
      //   accessorKey: "accountName",
      //   header: ({ column }) => <DataTableColumnHeader column={column} title="Account Name" />,
      //   cell: ({ row }) => (
      //     <span className="text-sm">{formatShortName(row.original.accountName)}</span>
      //     // className="flex max-w-[15%] items-start text-start"
      //   ),
      //   filterFn: filterFn,
      //   meta: { exportLabel: "Account Name" },
      // },
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
        enableSorting: true,
      },
      {
        accessorKey: "readingDate",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Reading Date" />,
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.readingDate ? formatDate(row.original.readingDate, "MMM d, yyyy hh:mm aa") : "—"}
          </span>
        ),
        meta: { exportLabel: "Reading Date" },
        enableColumnFilter: false,
      },
      {
        accessorKey: "remarks",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Remarks" />,
        cell: ({ row }) => (
          <span className="text-sm">{row.original.remarks ? row.original.remarks : "—"}</span>
        ),
        enableColumnFilter: true,
        filterFn: filterFn,
        meta: { exportLabel: "Remarks" },
      },
      {
        accessorKey: "isRead",
        accessorFn: (row) => (row.isRead === true ? "Read" : "Unread"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Read" />,
        cell: ({ row }) => (
          <span>
            {row.original.isRead === true ? (
              <CheckCircleIcon className="size-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircleIcon className="size-5 text-gray-700 dark:text-gray-200" />
            )}
          </span>
        ),
        enableColumnFilter: true,
        filterFn: filterFn,
        meta: { exportLabel: "Read" },
      },
      {
        accessorKey: "isCompleted",
        accessorFn: (row) => (row.isCompleted === true ? "Completed" : "Not yet completed"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Completed" />,
        cell: ({ row }) => (
          <span>
            {row.original.isCompleted === true ? (
              <CheckCircleIcon className="size-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircleIcon className="size-5 text-gray-700 dark:text-gray-200" />
            )}
          </span>
        ),
        enableColumnFilter: true,
        filterFn: filterFn,
        meta: { exportLabel: "Completed" },
      },
      {
        accessorKey: "isCommitted",
        accessorFn: (row) => (row.isCommitted === true ? "Committed" : "Not yet committed"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Committed" />,
        cell: ({ row }) => (
          <span>
            {row.original.isCommitted === true ? (
              <CheckCircleIcon className="size-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircleIcon className="size-5 text-gray-700 dark:text-gray-200" />
            )}
          </span>
        ),
        enableColumnFilter: true,
        filterFn: filterFn,
        meta: { exportLabel: "Committed" },
      },
      {
        accessorKey: "isPosted",
        accessorFn: (row) => (row.isPosted === true ? "Posted" : "Not yet posted"),
        header: ({ column }) => <DataTableColumnHeader column={column} title="Posted" />,
        cell: ({ row }) => (
          <span>
            {row.original.isPosted === true ? (
              <CheckCircleIcon className="size-5 text-green-600 dark:text-green-400" />
            ) : (
              <XCircleIcon className="size-5 text-gray-700 dark:text-gray-200" />
            )}
          </span>
        ),
        enableColumnFilter: true,
        filterFn: filterFn,
        meta: { exportLabel: "Posted" },
      },
    ];

    setAccountsColumns(cols);
  }, [data]);

  return accountsColumns;
};
