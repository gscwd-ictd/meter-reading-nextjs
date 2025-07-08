"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { Area } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { SquarePenIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

export const useAreasColumns = (data: Area[] | undefined) => {
  const [areaColumns, setAreaColumns] = useState<ColumnDef<Area>[]>([]);

  const filterFn: FilterFn<Area> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<Area>[] = [
      {
        accessorKey: "area",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone Book" />,
        enableColumnFilter: true,
        cell: ({ row }) => <span>{row.original.area}</span>,
        filterFn: filterFn,
        meta: { exportLabel: "Areas" },
      },

      {
        accessorKey: "id",
        header: "Actions",
        enableColumnFilter: false,
        cell: () => (
          <div className="flex gap-2">
            <SquarePenIcon
              className="bg-primary size-8 rounded p-2 text-white hover:cursor-pointer"
              role="button"
            />
            <TrashIcon
              className="text-primary size-8 rounded bg-blue-100 p-2 hover:cursor-pointer"
              role="button"
            />
          </div>
        ),
      },
    ];

    setAreaColumns(cols);
  }, [data]);

  return areaColumns;
};
