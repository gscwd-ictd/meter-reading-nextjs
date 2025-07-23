"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { ReadingDetails as BatchPostPostedColumn } from "@/lib/types/text-blast/ReadingDetails";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";

export const useBatchPostPostedColumns = (
  data: BatchPostPostedColumn[] | undefined,
  handleViewDetails: (row: BatchPostPostedColumn) => void,
) => {
  const [batchPostPostedColumns, setBatchPostPostedColumns] = useState<ColumnDef<BatchPostPostedColumn>[]>(
    [],
  );

  const dateFilterFn: FilterFn<BatchPostPostedColumn> = (row, columnId, value) => {
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

  useEffect(() => {
    const cols: ColumnDef<BatchPostPostedColumn>[] = [
      {
        accessorKey: "accountNumber",
        header: "Account No.",
        enableColumnFilter: false,
      },
      {
        accessorKey: "accountName",
        header: "Account Name",
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
        accessorKey: "readingDate",
        header: "Reading Date",
        cell: ({ row }) => {
          return format(row.getValue("readingDate"), "MM/dd/yyyy");
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
          return format(row.getValue("dueDate"), "MM/dd/yyyy");
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "disconnectionDate",
        header: "Disconnection Date",
        cell: ({ row }) => {
          return format(row.getValue("disconnectionDate"), "MM/dd/yyyy");
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          return status === ReadingDetailsStatus.POSTED ? (
            <Badge variant={"default"} className="w-20">
              Posted
            </Badge>
          ) : (
            <Badge variant={"outline"} className="w-20">
              Not Posted
            </Badge>
          );
        },
        enableColumnFilter: false,
      },
      {
        accessorKey: "datePosted",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Date Posted" />,
        cell: ({ row }) => {
          return format(row.getValue("datePosted"), "MM/dd/yyyy");
        },
        enableColumnFilter: true,
        filterFn: dateFilterFn,
        meta: {
          exportLabel: "Date Posted",
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button onClick={() => handleViewDetails(row.original)}>
            <Eye />
          </Button>
        ),
      },
    ];

    setBatchPostPostedColumns(cols);
  }, [data, handleViewDetails]);

  return batchPostPostedColumns;
};
