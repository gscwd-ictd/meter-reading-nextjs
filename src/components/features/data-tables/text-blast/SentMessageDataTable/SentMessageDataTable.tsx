"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { Heading } from "@mr/components/features/typography/Heading";
import { Badge } from "@mr/components/ui/Badge";

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
    <div className="min-w-full">
      <div className="flex flex-row justify-between items-center p-4 min-w-full bg-green-300/35">
        <Heading variant={"h4"} className="text-green-700">
          Sent
        </Heading>
        <Badge className="bg-green-700 px-3">
          <Heading variant={"h4"}>{table.getRowModel().rows?.length ?? 0}</Heading>
        </Badge>
      </div>
      <div className="m-4 h-[250px] overflow-scroll rounded-md border-1 border-gray-200 ">
        <Table>
          <TableHeader>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
