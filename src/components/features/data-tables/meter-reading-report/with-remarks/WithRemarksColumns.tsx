"use client";

import { formatToPHP } from "@mr/lib/functions/formatNumberToCurrency";
import { WithRemarksAccount } from "@mr/lib/types/accounts";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useWithRemarksColumns = (data: WithRemarksAccount[]) => {
  const [withRemarksAccounts, setWithRemarksAccounts] = useState<ColumnDef<WithRemarksAccount>[]>([]);

  useEffect(() => {
    const cols: ColumnDef<WithRemarksAccount>[] = [
      {
        accessorKey: "accountNumber",
        cell: (column) => <span>{column.row.original.accountNumber}</span>,
        header: "Account No",
        enableColumnFilter: true,
      },
      {
        accessorKey: "zone",
        cell: (column) => <span>{column.row.original.zone}</span>,
        header: "Zone",
        enableColumnFilter: true,
      },
      {
        accessorKey: "book",
        cell: (column) => <span>{column.row.original.book}</span>,
        header: "Book",
        enableColumnFilter: true,
      },
      {
        accessorKey: "usage",
        cell: (column) => <span>{column.row.original.usage}</span>,
        header: "Usage",
      },
      {
        accessorKey: "remarks",
        cell: (column) => <span>{column.row.original.remarks}</span>,
        header: "Remarks",
      },
      {
        accessorKey: "additionalRemarks",
        cell: (column) => <span>{column.row.original.additionalRemarks}</span>,
        header: "Additional Remarks",
      },
      {
        accessorKey: "billedAmount",
        cell: (column) => (
          <span>{column.row.original.billedAmount ? formatToPHP(column.row.original.billedAmount) : ""}</span>
        ),
        header: "Billed Amount",
      },
    ];

    setWithRemarksAccounts(cols);
  }, [data]);

  return withRemarksAccounts;
};
