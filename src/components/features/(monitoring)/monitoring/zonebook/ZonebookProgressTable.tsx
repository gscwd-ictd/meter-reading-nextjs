"use client";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { Badge } from "@mr/components/ui/Badge";
import { Progress } from "@mr/components/ui/Progress";
import { Card, CardHeader, CardTitle, CardContent } from "@mr/components/ui/Card";

type MeterReaderWithZonebooksReports = {
  id?: string;
  meterReader: string;
  zoneBook: string;
  accountsRead: number;
  totalAccounts: number;
  status: string;
  readingDate: string;
};

const columns: ColumnDef<MeterReaderWithZonebooksReports>[] = [
  {
    accessorKey: "zoneBook",
    header: "Zone Book",
    cell: ({ row }) => <div className="text-muted-foreground text-left">{row.getValue("zoneBook")}</div>,
  },
  {
    accessorKey: "meterReader",
    header: "Meter Reader",
    cell: ({ row }) => <div className="text-left font-medium">{row.getValue("meterReader")}</div>,
  },

  {
    id: "accounts",
    header: "Accounts",
    cell: ({ row }) => (
      <div className="text-left">
        <span className="font-medium">{row.original.accountsRead}</span>
        <span className="text-muted-foreground"> / {row.original.totalAccounts}</span>
      </div>
    ),
  },
  {
    id: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = Math.round((row.original.accountsRead / row.original.totalAccounts) * 100);
      return (
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 w-[120px]" />
          <span className="w-10 text-sm font-medium">{progress}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="outline"
          className={`capitalize ${
            status === "completed"
              ? "border-green-100 bg-green-50 text-green-700 hover:bg-green-50 dark:bg-green-900/20 dark:text-green-400"
              : status === "in progress"
                ? "border-yellow-100 bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
                : "border-yellow-100 bg-yellow-50 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "readingDate",
    header: "Reading Date",
    cell: ({ row }) => (
      <div className="text-muted-foreground text-left">
        {new Date(row.getValue("readingDate")).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </div>
    ),
  },
];

export function ZonebookProgressTable({ data }: { data: MeterReaderWithZonebooksReports[] }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="shadow-md">
      <CardHeader className="">
        <CardTitle className="text-lg">Zonebook Progress</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-10">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-muted-foreground h-24 text-center">
                    No meter reading data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
