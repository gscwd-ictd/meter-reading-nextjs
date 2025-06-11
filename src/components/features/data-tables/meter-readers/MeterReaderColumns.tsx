"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MeterReaderRowActions } from "./MeterReaderRowActions";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";

export const useMeterReaderColumns = (data: MeterReaderWithZonebooks[] | undefined) => {
  const [meterReaderColumns, setMeterReaderColumns] = useState<ColumnDef<MeterReaderWithZonebooks>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<MeterReaderWithZonebooks>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <span className="inline-flex items-center gap-2">
            <Avatar>
              <AvatarImage
                src={
                  row.original.photoUrl
                    ? `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${row.original.photoUrl}`
                    : undefined
                }
                alt={row.original.name}
                className="object-cover"
              />
              <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {row.original.name}
          </span>
        ),

        enableSorting: false,
      },

      {
        accessorKey: "zonebooks",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone-Book" />,
        cell: ({ row }) =>
          row.original.zonebooks.map((zoneBook, idx) => (
            <span key={zoneBook.zoneBook} className="w-full truncate">
              {zoneBook.zoneBook}
              {idx < row.original.zonebooks.length - 1 && ", "}
            </span>
          )),
        enableColumnFilter: false,
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <MeterReaderRowActions meterReader={row.original} />,
      },
    ];

    setMeterReaderColumns(cols);
  }, [data]);

  return meterReaderColumns;
};
