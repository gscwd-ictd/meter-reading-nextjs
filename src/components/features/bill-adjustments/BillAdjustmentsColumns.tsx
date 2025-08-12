import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { BillAdjustment } from "@mr/lib/types/bill-adjustments";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useBillAdjustmentsColumns = (data: BillAdjustment[] | undefined) => {
  const [billAdjustmentColumns, setBillAdjustmentColumns] = useState<ColumnDef<BillAdjustment>[]>([]);

  const filterFn: FilterFn<BillAdjustment> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<BillAdjustment>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Areas" />,
        enableColumnFilter: true,
        cell: ({ row }) => <span>{row.original.name}</span>,
        filterFn: filterFn,
        meta: { exportLabel: "Name" },
      },
      {
        accessorKey: "percentage",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Areas" />,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <>
            <span>{row.original.percentage}</span>
            <span>%</span>
          </>
        ),
        filterFn: filterFn,
        meta: { exportLabel: "Percentage" },
      },
    ];
    setBillAdjustmentColumns(cols);
  }, [data]);

  return billAdjustmentColumns;
};
