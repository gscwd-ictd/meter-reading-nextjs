"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { AccountWithDates as AreaTextBlastColumn } from "@mr/lib/types/text-blast/ReadingDetails";

export const useAreaTextBlastColumns = () => {
  const columns = useMemo(
    () =>
      [
        {
          accessorKey: "accountNumber",
          header: "Account No.",
          cell: ({ row }) => {
            const accountNumber = row.original.accountNumber;
            const consumerType = row.original.consumerType;

            return `${accountNumber}-${consumerType}`;
          },
          enableColumnFilter: false,
        },
        {
          accessorKey: "consumerName",
          header: "Account Name",
          cell: ({ row }) => (
            <div className="max-w-[200px] truncate" title={row.original.consumerName}>
              {row.original.consumerName}
            </div>
          ),
          enableColumnFilter: false,
        },
        {
          accessorKey: "contactNumber",
          header: "Contact No.",
          enableColumnFilter: false,
        },
        {
          accessorKey: "waterBalance",
          header: "Billed Amount",
          cell: ({ row }) => {
            const amount = parseFloat(row.getValue("waterBalance"));
            return new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(amount);
          },
          enableColumnFilter: false,
        },
        {
          accessorKey: "dueDate",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
          cell: ({ row }) => {
            const dueDate = new Date(row.original.dueDate);
            return format(dueDate, "MM/dd/yyyy");
          },
          sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId)).getTime();
            const dateB = new Date(rowB.getValue(columnId)).getTime();
            return dateA - dateB;
          },
          enableColumnFilter: false,
        },
        {
          accessorKey: "disconnectionDate",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Disconnection Date" />,
          cell: ({ row }) => {
            const date = row.original.disconnectionDate
              ? format(row.original.disconnectionDate, "MM/dd/yyyy")
              : "";
            return date;
          },
          sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId)).getTime();
            const dateB = new Date(rowB.getValue(columnId)).getTime();
            return dateA - dateB;
          },
          enableColumnFilter: false,
        },
      ] satisfies ColumnDef<AreaTextBlastColumn>[],
    [],
  );
  return columns;
};
