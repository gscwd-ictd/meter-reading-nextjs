"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Concessionaire as AreaTextBlastColumn } from "@/lib/types/concessionaire";
import { format } from "date-fns";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";

export const useAreaTextBlastColumns = (data: AreaTextBlastColumn[] | undefined) => {
  const [areaTextBlastColumns, setAreaTextBlastColumns] = useState<ColumnDef<AreaTextBlastColumn>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<AreaTextBlastColumn>[] = [
      {
        accessorKey: "accountNo",
        header: "Account No.",
      },
      {
        accessorKey: "concessionaireName",
        header: "Name",
      },
      {
        accessorKey: "primaryContactNumber",
        header: "Contact Number",
        cell: ({ row }) => {
          const number = row.getValue("primaryContactNumber") as string;
          return number ? `+${number.slice(1, 3)}${number.slice(3, 6)}${number.slice(6)}` : "-";
        },
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
      },
      {
        accessorKey: "zone",
        header: "Zone",
      },
      {
        accessorKey: "book",
        header: "Book",
      },
      {
        accessorKey: "billMonthYear",
        header: "Bill Month/Year",
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
      },
    ];

    setAreaTextBlastColumns(cols);
  }, [data]);

  return areaTextBlastColumns;
};
