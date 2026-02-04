"use client";

import { Zonebook } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useAssignedZonebooksColumns = (data: Zonebook[]) => {
  const [assignedZonebooks, setAssignedZonebooks] = useState<ColumnDef<Zonebook>[]>([]);
  const filterFn: FilterFn<Zonebook> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<Zonebook>[] = [
      {
        accessorKey: "day",
        cell: (column) => <span>{column.row.original.day}</span>,
        header: "Day",
        filterFn: filterFn,
        enableColumnFilter: true,
      },
      {
        accessorKey: "zone",
        cell: (column) => <span>{column.row.original.zone}</span>,
        header: "Zone",
        enableColumnFilter: true,
        filterFn: filterFn,
      },
      {
        accessorKey: "book",
        cell: (column) => <span>{column.row.original.book}</span>,
        header: "Book",
        filterFn: filterFn,
        enableColumnFilter: true,
      },
      {
        accessorKey: "area.name",
        cell: (column) => <span>{column.row.original.area.name}</span>,
        header: "Area",
        filterFn: filterFn,
        enableColumnFilter: true,
      },
    ];

    setAssignedZonebooks(cols);
  }, [data]);

  return assignedZonebooks;
};
