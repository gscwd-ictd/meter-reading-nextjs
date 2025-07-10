"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MeterReaderEntryRowActions } from "./MeterReaderEntryRowActions";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { Avatar, AvatarFallback, AvatarImage } from "@mr/components/ui/Avatar";
import { ZonebookPreview } from "../../zonebook/ZonebookPreview";

export const useMeterReaderEntryColumns = (data: MeterReaderWithZonebooks[] | undefined) => {
  const [meterReaderEntryColumns, setMeterReaderEntryColumns] = useState<
    ColumnDef<MeterReaderWithZonebooks>[]
  >([]);

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
        meta: { exportLabel: "Name" },

        enableSorting: true,
      },

      {
        accessorKey: "zoneBooks",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone Books" />,
        cell: ({ row }) => <ZonebookPreview zonebooks={row.original.zoneBooks} />,
        enableColumnFilter: false,
        enableSorting: false,
      },

      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <MeterReaderEntryRowActions meterReader={row.original} />,
      },
    ];

    setMeterReaderEntryColumns(cols);
  }, [data]);

  return meterReaderEntryColumns;
};
