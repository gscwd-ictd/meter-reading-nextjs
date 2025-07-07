"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { MeterReaderRowActions } from "./MeterReaderRowActions";
import { MeterReader as PersonnelColumn } from "@mr/lib/types/personnel";
import { Badge } from "@mr/components/ui/Badge";
import { ZonebookPreview } from "../../zonebook/ZonebookPreview";

export const useMeterReaderColumns = (data: PersonnelColumn[] | undefined) => {
  const [meterReaderColumns, setMeterReaderColumns] = useState<ColumnDef<PersonnelColumn>[]>([]);

  const filterFn: FilterFn<PersonnelColumn> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  const filterByZonebookFn: FilterFn<PersonnelColumn> = (row, columnId, filterValue) => {
    return filterValue.filter(row.original.zoneBooks);
  };

  useEffect(() => {
    const cols: ColumnDef<PersonnelColumn>[] = [
      {
        accessorKey: "companyId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID No." />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.companyId}</span>,
        enableColumnFilter: true,
        meta: {
          exportLabel: "Company ID",
        },
      },
      {
        accessorKey: "name",
        header: "Meter Reader",
        filterFn: filterFn,
        cell: ({ row }) => (
          <div>
            <div className="flex flex-col">
              <div className="flex items-center justify-start gap-2">
                <div>{row.original.name}</div>
                {/* <Badge className="text-xs">{row.original.companyId}</Badge> */}
              </div>
              <div className="text-xs text-gray-500">{row.original.positionTitle}</div>
            </div>
          </div>
        ),
        enableColumnFilter: true,
        meta: {
          exportLabel: "Name",
        },
      },
      // {
      //   accessorKey: "positionTitle",
      //   header: ({ column }) => <DataTableColumnHeader column={column} title="Position Title" />,
      //   filterFn: filterFn,
      //   cell: ({ row }) => (
      //     <div>
      //       <div className="flex flex-col">
      //         <div>{row.original.positionTitle}</div>
      //         <div>{row.original.positionTitle}</div>
      //       </div>
      //     </div>
      //   ),
      //   meta: {
      //     exportLabel: "Position Title",
      //   },
      // },
      {
        accessorKey: "mobileNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No." />,
        cell: ({ row }) => <span className="text-sm tabular-nums">{row.original.mobileNumber}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "zoneBooks",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zonebooks" />,
        cell: ({ row }) => <ZonebookPreview zonebooks={row.original.zoneBooks} />,
        enableColumnFilter: false,
      },
      {
        accessorKey: "restDay",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rest Day" />,
        cell: ({ row }) => (
          <span>
            {row.original.restDay === "sunday" ? (
              <Badge className="w-[4rem] border-black bg-gray-50 text-black">Sunday</Badge>
            ) : row.original.restDay === "saturday" ? (
              <Badge className="w-[4rem] border-black bg-black text-white">Saturday</Badge>
            ) : null}
          </span>
        ),
        filterFn: filterFn,
        meta: {
          exportLabel: "Rest day",
        },
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
