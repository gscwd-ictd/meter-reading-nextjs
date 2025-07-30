"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { Zonebook } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { ZonebookRowActions } from "./ZonebookRowActions";

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
        accessorKey: "rea",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Area" />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.area?.name ?? "-"}</span>,
        meta: {
          exportLabel: "Area",
        },
      },

      {
        header: "Actions",
        cell: ({ row }) => (
          <ZonebookRowActions
            zonebook={{
              area: row.original.area,
              book: row.original.book,
              zone: row.original.zone,
              zoneBook: row.original.zoneBook,
              // zoneBookId: row.original.zoneBookId,
              // areaId: row.original.areaId,
            }}
          />
        ),
      },
    ];

    setAreaColumns(cols);
  }, [data]);

  return areaColumns;
};
