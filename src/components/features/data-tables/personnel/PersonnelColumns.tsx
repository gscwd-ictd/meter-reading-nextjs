"use client";

import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { PersonnelRowActions } from "./PersonnelRowActions";
import { MeterReader as PersonnelColumn } from "@mr/lib/types/personnel";

export const usePersonnelColumns = (data: PersonnelColumn[] | undefined) => {
  const [personnelColumns, setPersonnelColumns] = useState<ColumnDef<PersonnelColumn>[]>([]);

  const filterFn: FilterFn<PersonnelColumn> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const cols: ColumnDef<PersonnelColumn>[] = [
      {
        accessorKey: "companyId",
        header: ({ column }) => <DataTableColumnHeader column={column} title="ID No." />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.companyId}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
        cell: ({ row }) => <span>{row.original.name}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "positionTitle",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Position Title" />,
        filterFn: filterFn,
        cell: ({ row }) => <span>{row.original.positionTitle}</span>,
        meta: {
          exportLabel: "Position Title",
        },
      },
      {
        accessorKey: "restDay",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Rest Day" />,
        cell: ({ row }) => (
          <span>
            {row.original.restDay === "sunday"
              ? "Sunday"
              : row.original.restDay === "saturday"
              ? "Saturday"
              : null}
          </span>
        ),
        filterFn: filterFn,
        meta: {
          exportLabel: "Rest day",
        },
      },

      {
        accessorKey: "mobileNumber",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Contact No." />,
        cell: ({ row }) => <span>{row.original.mobileNumber}</span>,
        enableColumnFilter: false,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <PersonnelRowActions companyId={row.original.companyId} />,
      },
    ];

    setPersonnelColumns(cols);
  }, [data]);

  return personnelColumns;
};
