"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { createContext, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { AreaTextBlastDataTableToolbar } from "./AreaTextBlastDataTableToolbar";

interface AreaTextBlastDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableColumnVisibilityToggle?: boolean;
}

type ColumnVisibilityToggleContextState = {
  enableColumnVisibilityToggle?: boolean;
};

export const ColumnVisibilityToggleContext = createContext<ColumnVisibilityToggleContextState>({
  enableColumnVisibilityToggle: undefined,
});

export function AreaTextBlastDataTable<TData, TValue>({
  columns,
  data,
  enableColumnVisibilityToggle = true,
}: AreaTextBlastDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div>
      <ColumnVisibilityToggleContext.Provider value={{ enableColumnVisibilityToggle }}>
        <AreaTextBlastDataTableToolbar table={table} />
      </ColumnVisibilityToggleContext.Provider>

      <div className="overflow-auto rounded-md border sm:h-60 md:h-80 lg:h-100">
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

      <div className="pt-4 pb-10">
        <div className="flex h-10 items-center justify-between px-2">
          <div className="flex flex-row items-center justify-end gap-2">
            <p className="text-lg font-semibold">Total Contacts</p>
            <Badge
              className="px-3"
              variant={`${table.getCoreRowModel().rows.length > 0 ? "default" : "outline"}`}
            >
              <p className="text-lg">{table.getCoreRowModel().rows.length ?? 0}</p>
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
