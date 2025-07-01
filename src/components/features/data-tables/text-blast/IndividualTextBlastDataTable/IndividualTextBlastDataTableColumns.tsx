"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Concessionaire as IndividualTextBlastColumn } from "@/lib/types/concessionaire";
import { Checkbox } from "@/components/ui/Checkbox";
import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const useIndividualTextBlastColumns = (data: IndividualTextBlastColumn[] | undefined) => {
  const [individualTextBlastColumns, setIndividualTextBlastColumns] = useState<
    ColumnDef<IndividualTextBlastColumn>[]
  >([]);

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

  const { selectedRecipients, addSelectedRecipient, removeSelectedRecipient } = useTextBlastStore();

  useEffect(() => {
    const cols: ColumnDef<IndividualTextBlastColumn>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                table.getRowModel().rows.forEach((row) => {
                  if (!selectedRecipients.some((r) => r.consumerId === row.original.consumerId)) {
                    addSelectedRecipient(row.original);
                  }
                });
              } else {
                table.getRowModel().rows.forEach((row) => {
                  removeSelectedRecipient(row.original.consumerId);
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
                addSelectedRecipient(row.original);
              } else {
                removeSelectedRecipient(row.original.consumerId);
              }
            }}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "accountNo",
        header: "Account No.",
        enableColumnFilter: false,
      },
      {
        accessorKey: "concessionaireName",
        header: "Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "primaryContactNumber",
        header: "Contact Number",
        cell: ({ row }) => {
          const number = row.getValue("primaryContactNumber") as string;
          return number ? `+${number.slice(1, 3)}${number.slice(3, 6)}${number.slice(6)}` : "-";
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "billedAmount",
        header: "Current Bill",
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
        enableColumnFilter: false,
        sortingFn: (rowA, rowB, columnId) => {
          const dateA = new Date(rowA.getValue(columnId)).getTime();
          const dateB = new Date(rowB.getValue(columnId)).getTime();
          return dateA - dateB;
        },
      },
    ];

    setIndividualTextBlastColumns(cols);
  }, [addSelectedRecipient, data, removeSelectedRecipient, selectedRecipients]);

  return individualTextBlastColumns;
};
