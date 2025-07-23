import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Heading } from "@/components/features/typography/Heading";
import { Badge } from "@/components/ui/Badge";
import { FileX2 } from "lucide-react";

interface SentMessageDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function SentMessageDataTable<TData, TValue>({
  columns,
  data,
}: SentMessageDataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex flex-row items-center justify-between bg-green-300/35 p-4">
        <Heading variant={"h4"} className="text-green-700">
          Sent
        </Heading>
        <Badge className="bg-green-700 px-3">
          <Heading variant={"h4"}>{table.getRowModel().rows?.length ?? 0}</Heading>
        </Badge>
      </div>
      <div className="m-4 h-80 overflow-scroll rounded-md border-1 border-gray-200">
        <Table>
          <TableHeader className="sticky">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex w-full items-center justify-center gap-2">
                    <FileX2 className="text-muted-foreground dark:text-muted h-7 w-7" />
                    <span className="text-muted-foreground dark:text-muted text-2xl font-extrabold tracking-wide">
                      No Results
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
