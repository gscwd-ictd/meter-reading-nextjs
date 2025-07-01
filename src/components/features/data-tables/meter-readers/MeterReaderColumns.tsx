"use client";

import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MeterReaderRowActions } from "./MeterReaderRowActions";
import { MeterReader } from "@/lib/types/personnel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";

export const useMeterReaderColumns = (data: MeterReader[] | undefined) => {
  const [meterReaderColumns, setMeterReaderColumns] = useState<ColumnDef<MeterReader>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<MeterReader>[] = [
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => (
          <span className=" items-center inline-flex gap-2">
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
        cell: ({ row }) => (
          <span>
            {row.original.zonebooks.map((zb) => {
              return `${zb.zonebook}, `;
            })}
          </span>
        ),
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
