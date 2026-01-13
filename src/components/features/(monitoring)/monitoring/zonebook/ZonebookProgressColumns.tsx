import { Badge } from "@mr/components/ui/Badge";
import { DataTableColumnHeader } from "@mr/components/ui/data-table/data-table-column-header";
import { Progress } from "@mr/components/ui/Progress";
import { ZonebookProgress } from "@mr/lib/types/zonebook";
import { ColumnDef, FilterFn } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const useZonebookProgressColumns = (data: ZonebookProgress[] | undefined) => {
  const [zonebookProgressColumns, setZonebookProgressColumns] = useState<ColumnDef<ZonebookProgress>[]>([]);

  const filterFn: FilterFn<ZonebookProgress> = (row, columnId, filterValue) => {
    // filterValue is an array of selected options
    return filterValue.includes(row.getValue(columnId));
  };

  useEffect(() => {
    const columns: ColumnDef<ZonebookProgress>[] = [
      {
        accessorKey: "zone",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Zone" />,
        cell: ({ row }) => <div className="text-muted-foreground text-left">Zone {row.original.zone}</div>,
        meta: { exportLabel: "Zone" },
        enableColumnFilter: true,
        filterFn: filterFn,
      },
      {
        accessorKey: "book",
        header: ({ column }) => <DataTableColumnHeader column={column} title="Book" />,
        cell: ({ row }) => <div className="text-muted-foreground text-left">Book {row.original.book}</div>,
        meta: { exportLabel: "Book" },
        filterFn: filterFn,
        enableColumnFilter: true,
      },
      {
        accessorKey: "meterReader.name",
        header: "Meter Reader",
        cell: ({ row }) => <div className="text-left font-medium">{row.original.meterReader.name}</div>,
        meta: { exportLabel: "Meter Reader" },
        filterFn: filterFn,
      },

      {
        id: "accounts",
        header: "Accounts",
        cell: ({ row }) => (
          <div className="text-left">
            <span className="font-medium">{row.original.totalRead}</span>
            <span className="text-muted-foreground"> / {row.original.totalAccounts}</span>
          </div>
        ),
      },
      {
        id: "progress",
        header: "Progress",
        cell: ({ row }) => {
          const progress = Math.round((row.original.totalRead / row.original.totalAccounts) * 100);
          return (
            <div className="flex items-center gap-3">
              <Progress value={progress} className="h-2 w-[120px]" />
              <span className="w-10 text-sm font-medium">{progress}%</span>
            </div>
          );
        },
        filterFn: filterFn,
      },
      {
        accessorKey: "statusProgress",
        header: "Status",
        cell: ({ row }) => {
          const statusProgress = row.getValue("statusProgress") as string;
          return (
            <Badge
              variant="outline"
              className={`capitalize ${
                statusProgress === "completed"
                  ? "border-green-100 bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
                  : statusProgress === "in progress"
                    ? "border-yellow-100 bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
                    : "border-yellow-100 bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
              }`}
            >
              {statusProgress}
            </Badge>
          );
        },
        meta: { exportLabel: "Progress" },
      },
      //   {
      //     accessorKey: "readingDate",
      //     header: "Reading Date",
      //     cell: ({ row }) => (
      //       <div className="text-muted-foreground text-left">
      //         {/* {new Date(row.getValue("readingDate")).toLocaleDateString("en-US", {
      //       year: "numeric",
      //       month: "short",
      //       day: "numeric",
      //     })} */}
      //         {row.getValue("readingDate")
      //           ? new Date(row.getValue("readingDate")).toLocaleDateString("en-US", {
      //               year: "numeric",
      //               month: "short",
      //               day: "numeric",
      //             })
      //           : "-"}
      //       </div>
      //     ),
      //   },
      {
        id: "action",
        cell: ({ row }) => {
          if (row.original.statusProgress === "in progress") return "-";
          else if (row.original.statusProgress === "completed") {
            if (row.original.isCommitted === false)
              return (
                <Badge className="rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-700">For commit</Badge>
              );
            else
              return (
                <Badge className="rounded-md bg-green-600 px-3 py-1 text-xs text-white">Committed</Badge>
              );
          }
        },
      },
    ];
    setZonebookProgressColumns(columns);
  }, [data]);

  return zonebookProgressColumns;
};
