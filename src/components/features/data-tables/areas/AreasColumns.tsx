"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { Area } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AreaRowActions } from "../../(administration)/areas/AreaRowActions";

export const useAreasColumns = (data: Area[] | undefined) => {
  const [areaColumns, setAreaColumns] = useState<ColumnDef<Area>[]>([]);

  const filterFn: FilterFn<Area> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<Area>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Areas" />,
        enableColumnFilter: true,
        cell: ({ row }) => <span>{row.original.name}</span>,
        filterFn: filterFn,
        meta: { exportLabel: "Areas" },
      },

      {
        accessorKey: "id",
        header: "Actions",
        enableColumnFilter: false,
        cell: ({ row }) => <AreaRowActions details={{ name: row.original.name, id: row.original.id! }} />,
      },
    ];

    setAreaColumns(cols);
  }, [data]);

  return areaColumns;
};
