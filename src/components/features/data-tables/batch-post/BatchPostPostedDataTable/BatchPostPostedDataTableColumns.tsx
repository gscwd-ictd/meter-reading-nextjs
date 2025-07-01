"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { BatchPost as BatchPostPostedColumn, BatchPostStatus } from "@/lib/types/batch-post";
import { Button } from "@/components/ui/Button";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const useBatchPostPostedColumns = (
  data: BatchPostPostedColumn[] | undefined,
  handleViewDetails: (row: BatchPostPostedColumn) => void,
) => {
  const [batchPostPostedColumns, setBatchPostPostedColumns] = useState<ColumnDef<BatchPostPostedColumn>[]>(
    [],
  );

  useEffect(() => {
    const cols: ColumnDef<BatchPostPostedColumn>[] = [
      {
        accessorKey: "accountNo",
        header: "Account No.",
        cell: ({ row }) => <span>{row.original.accountNo}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "concessionaireName",
        header: "Concessionaire Name",
        cell: ({ row }) => <span>{row.original.accountName}</span>,
        enableColumnFilter: false,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status");
          return status === BatchPostStatus.POSTED ? (
            <Badge variant={"default"} className="w-20">
              Posted
            </Badge>
          ) : (
            <Badge variant={"outline"} className="w-20">
              Not Posted
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Button onClick={() => handleViewDetails(row.original)}>
            <Eye />
          </Button>
        ),
      },
    ];

    setBatchPostPostedColumns(cols);
  }, [data, handleViewDetails]);

  return batchPostPostedColumns;
};
