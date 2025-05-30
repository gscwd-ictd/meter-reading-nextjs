"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { Zonebook } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useZonebookColumns = (data: Zonebook[] | undefined) => {
  const [areaColumns, setAreaColumns] = useState<ColumnDef<Zonebook>[]>([]);

  const filterFn: FilterFn<Zonebook> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<Zonebook>[] = [
      {
        accessorKey: "zonebook",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone Book" />,
        enableColumnFilter: false,
        cell: ({ row }) => <span>{row.original.zonebook}</span>,
      },
      {
        accessorKey: "zone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone" />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.zone}</span>,
        meta: {
          exportLabel: "Zone",
        },
      },

      {
        accessorKey: "book",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Book" />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.book}</span>,
        meta: {
          exportLabel: "Book",
        },
      },

      {
        accessorKey: "area",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Area" />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.area}</span>,
        meta: {
          exportLabel: "Area",
        },
      },
      // {
      //   accessorKey: "totalConsumers",
      //   header: ({ column }) => <DataTableColumnHeader column={column} title="Total Consumers" />,
      //   enableColumnFilter: false,
      //   cell: ({ row }) => <span>{row.original.totalConsumers}</span>,
      // },
      // {
      //   accessorKey: "active",
      //   header: ({ column }) => <DataTableColumnHeader column={column} title="Active" />,
      //   enableColumnFilter: false,
      //   cell: ({ row }) => <span>{row.original.active}</span>,
      // },
    ];

    setAreaColumns(cols);
  }, [data]);

  return areaColumns;
};
