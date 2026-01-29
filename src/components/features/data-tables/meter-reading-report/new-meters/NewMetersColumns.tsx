"use client";

import { NewMeterAccount } from "@mr/lib/types/accounts";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";

export const useNewMetersColumns = (data: NewMeterAccount[]) => {
  const [newMetersAccounts, setNewMetersAccounts] = useState<ColumnDef<NewMeterAccount>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<NewMeterAccount>[] = [
      {
        accessorKey: "meterNumber",
        cell: (column) => <span>{column.row.original.meterNumber}</span>,
        header: "Meter No",
        enableColumnFilter: true,
      },

      {
        accessorKey: "currentReading",
        cell: (column) => <span>{column.row.original.currentReading}</span>,
        header: "Current Reading",
      },
      {
        accessorKey: "dateTime",
        cell: (column) => (
          <span>
            {column.row.original.dateTime ? format(column.row.original.dateTime, "MMM dd, yyyy hh:mm:a") : ""}
          </span>
        ),
        header: "Date Time",
      },
      {
        accessorKey: "meterReader",
        cell: (column) => <span>{column.row.original.meterReader.name}</span>,
        header: "Meter Reader",
      },
    ];

    setNewMetersAccounts(cols);
  }, [data]);

  return newMetersAccounts;
};
