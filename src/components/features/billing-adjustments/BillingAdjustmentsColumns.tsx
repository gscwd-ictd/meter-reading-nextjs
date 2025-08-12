import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { BillingAdjustment } from "@mr/lib/types/billing-adjustment";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useBillAdjustmentsColumns = (data: BillingAdjustment[] | undefined) => {
  const [billingAdjustmentColumns, setBillingAdjustmentColumns] = useState<ColumnDef<BillingAdjustment>[]>(
    [],
  );

  const filterFn: FilterFn<BillingAdjustment> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<BillingAdjustment>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        enableColumnFilter: true,
        cell: ({ row }) => <span>{row.original.name}</span>,
        filterFn: filterFn,
        meta: { exportLabel: "Name" },
      },
      {
        accessorKey: "percentage",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Percentage" />,
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
    setBillingAdjustmentColumns(cols);
  }, [data]);

  return billingAdjustmentColumns;
};
