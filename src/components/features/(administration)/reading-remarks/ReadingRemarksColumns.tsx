import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ReadingRemark } from "@mr/lib/types/reading-remark";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { ReadingRemarksRowActions } from "./ReadingRemarksRowActions";

export const useReadingRemarksColumns = (data: ReadingRemark[] | undefined) => {
  const [readingRemarksColumns, setReadingRemarksColumns] = useState<ColumnDef<ReadingRemark>[]>([]);

  const filterFn: FilterFn<ReadingRemark> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<ReadingRemark>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        enableColumnFilter: true,
        cell: ({ row }) => <span>{row.original.name}</span>,
        filterFn: filterFn,
        meta: { exportLabel: "Name" },
      },
      {
        accessorKey: "isAverage",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Average" />,
        cell: ({ row }) => (
          <>
            <span>{row.original.isAverage ? "Yes" : "No"}</span>
          </>
        ),
        enableColumnFilter: true,
        enableSorting: true,
        meta: { exportLabel: "Is Average" },
      },
      {
        accessorKey: "isActive",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
        cell: ({ row }) => (
          <>
            <span>{row.original.isActive ? "Yes" : "No"}</span>
          </>
        ),
        enableColumnFilter: true,
        meta: { exportLabel: "Is Active" },
        enableSorting: true,
      },
      {
        accessorKey: "id",
        header: "Actions",
        enableColumnFilter: false,
        cell: ({ row }) => (
          <ReadingRemarksRowActions
            details={{
              name: row.original.name,
              id: row.original.id!,
              isActive: row.original.isActive,
              isAverage: row.original.isAverage,
            }}
          />
        ),
      },
    ];
    setReadingRemarksColumns(cols);
  }, [data]);

  return readingRemarksColumns;
};
