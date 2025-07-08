"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { Zonebook } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { PlusIcon, SquarePenIcon } from "lucide-react";
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
        accessorKey: "zoneBook",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone Book" />,
        enableColumnFilter: false,
        cell: ({ row }) => <span>{row.original.zoneBook}</span>,
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
        cell: ({ row }) => <span>{row.original.area ?? "-"}</span>,
        meta: {
          exportLabel: "Area",
        },
      },

      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {!row.original.areaId && (
              <PlusIcon className="text-primary size-8 rounded bg-gray-200 p-2 hover:cursor-pointer" />
            )}
            {row.original.areaId && (
              <SquarePenIcon className="bg-primary size-8 rounded p-2 text-white hover:cursor-pointer" />
            )}
          </div>
        ),
      },
      // {accessorKey:'zoneBook', cell: ({row})=>}
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
