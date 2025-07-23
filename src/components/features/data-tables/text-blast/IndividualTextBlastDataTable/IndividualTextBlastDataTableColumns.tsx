"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { ReadingDetails as IndividualTextBlastColumn } from "@mr/lib/types/text-blast/ReadingDetails";
import { Checkbox } from "@mr/components/ui/Checkbox";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { useMemo } from "react";

export const useIndividualTextBlastColumns = () => {
  const { selectedConsumers, addSelectedConsumer, removeSelectedConsumer } = useTextBlastStore();

  const dateFilterFn: FilterFn<IndividualTextBlastColumn> = (row, columnId, value) => {
    const rowValue = row.getValue(columnId) as string;
    if (!rowValue || !value) return true;

    const rowDate = new Date(rowValue);
    const filterDate = new Date(value);

    return (
      rowDate.getFullYear() === filterDate.getFullYear() &&
      rowDate.getMonth() === filterDate.getMonth() &&
      rowDate.getDate() === filterDate.getDate()
    );
  };

  const columns = useMemo(
    () =>
      [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) => {
                table.toggleAllPageRowsSelected(!!value);
                if (value) {
                  table.getRowModel().rows.forEach((row) => {
                    if (!selectedConsumers.some((r) => r.accountNumber === row.original.accountNumber)) {
                      addSelectedConsumer(row.original);
                    }
                  });
                } else {
                  table.getRowModel().rows.forEach((row) => {
                    removeSelectedConsumer(row.original.accountNumber);
                  });
                }
              }}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => {
                row.toggleSelected(!!value);
                if (value) {
                  addSelectedConsumer(row.original);
                } else {
                  removeSelectedConsumer(row.original.accountNumber);
                }
              }}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "accountNumber",
          header: "Account No.",
          enableColumnFilter: false,
        },
        {
          accessorKey: "consumerName",
          header: "Account Name",
          enableColumnFilter: false,
        },
        {
          accessorKey: "contactNumber",
          header: "Contact No.",
          enableColumnFilter: false,
        },
        {
          accessorKey: "billedAmount",
          header: "Billed Amount",
          cell: ({ row }) => {
            const amount = parseFloat(row.getValue("billedAmount"));
            return new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(amount);
          },
          enableColumnFilter: false,
        },
        {
          accessorKey: "zone",
          header: "Zone",
          enableColumnFilter: false,
        },
        {
          accessorKey: "book",
          header: "Book",
          enableColumnFilter: false,
        },
        {
          accessorKey: "billMonthYear",
          header: "Bill Month/Year",
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
          filterFn: dateFilterFn,
          meta: {
            exportLabel: "Due Date",
          },
        },
        {
          accessorKey: "disconnectionDate",
          header: ({ column }) => <DataTableColumnHeader column={column} title="Disconnection Date" />,
          cell: ({ row }) => {
            const disconnectionDate = format(row.original.disconnectionDate, "MM/dd/yyyy");
            return disconnectionDate;
          },
          sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.getValue(columnId)).getTime();
            const dateB = new Date(rowB.getValue(columnId)).getTime();
            return dateA - dateB;
          },
          enableColumnFilter: false,
        },
      ] satisfies ColumnDef<IndividualTextBlastColumn>[],
    [selectedConsumers, addSelectedConsumer, removeSelectedConsumer],
  );

  return columns;
};
