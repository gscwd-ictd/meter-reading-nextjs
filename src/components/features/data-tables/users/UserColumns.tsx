"use client";
import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { MeterReader } from "@mr/lib/types/personnel";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useUserColumns = (data: MeterReader[]) => {
  const [userColumns, setUserColumns] = useState<ColumnDef<MeterReader>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<MeterReader>[] = [
      {
        accessorKey: "meterReaderId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
        enableColumnFilter: true,
        cell: ({ row }) => <span>{row.original.name}</span>,
      },
    ];

    setUserColumns(cols);
  }, [data]);

  return userColumns;
};
