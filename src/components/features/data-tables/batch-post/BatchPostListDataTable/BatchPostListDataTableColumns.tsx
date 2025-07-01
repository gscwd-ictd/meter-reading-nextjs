"use client";

import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { BatchPost as BatchPostColumn, BatchPostStatus } from "@/lib/types/batch-post";
import { useBatchPostStore } from "@/components/stores/useBatchPostStore";
import { Badge } from "@/components/ui/Badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";

export const useBatchPostColumns = (
  data: BatchPostColumn[] | undefined,
  handleViewDetails: (row: BatchPostColumn) => void,
) => {
  const [batchPostColumns, setBatchPostColumns] = useState<ColumnDef<BatchPostColumn>[]>([]);

  const dateFilterFn: FilterFn<BatchPostColumn> = (row, columnId, value) => {
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

  const { selectedConcessionaires, addSelectedConcessionaire, removeSelectedConcessionaire } =
    useBatchPostStore();

  useEffect(() => {
    const cols: ColumnDef<BatchPostColumn>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => {
              table.toggleAllPageRowsSelected(!!value);
              if (value) {
                table.getRowModel().rows.forEach((row) => {
                  if (!selectedConcessionaires.some((r) => r.accountNo === row.original.accountNo)) {
                    addSelectedConcessionaire(row.original);
                  }
                });
              } else {
                table.getRowModel().rows.forEach((row) => {
                  removeSelectedConcessionaire(row.original.accountNo);
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
                addSelectedConcessionaire(row.original);
              } else {
                removeSelectedConcessionaire(row.original.accountNo);
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
        accessorKey: "accountName",
        header: "Name",
        enableColumnFilter: false,
      },
      {
        accessorKey: "readingDate",
        header: "Reading Date",
        cell: ({ row }) => {
          return format(row.getValue("readingDate"), "MM/dd/yyyy");
        },
        enableColumnFilter: true,
        filterFn: dateFilterFn,
        meta: {
          exportLabel: "Reading Date",
        },
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
        accessorKey: "status",
        header: "Status",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const status = row.getValue("status");
          return status === BatchPostStatus.POSTED ? (
            <Badge variant={"default"} className="w-20">
              Posted
            </Badge>
          ) : (
            <Badge variant={"outline"} className="w-20">
              Not Posted
            </Badge>
          );
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

    setBatchPostColumns(cols);
  }, [data, addSelectedConcessionaire, removeSelectedConcessionaire, selectedConcessionaires, handleViewDetails]);

  return batchPostColumns;
};
