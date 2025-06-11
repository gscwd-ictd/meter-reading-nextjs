"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { DataTablePagination } from "./data-table-pagination";
import { Input } from "@mr/components/ui/Input";
import { DataTableToolbar } from "./data-table-toolbar";
import { createContext, useEffect, useState } from "react";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { FileX2 } from "lucide-react";

type DataTableProps<T> = {
  columns: Array<ColumnDef<T, unknown>>;
  data: T[];
  enableColumnVisibilityToggle?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  loading?: boolean;
};

type ColumnVisibilityToggleContextState = {
  enableColumnVisibilityToggle?: boolean;
};

export const ColumnVisibilityToggleContext = createContext<ColumnVisibilityToggleContextState>({
  enableColumnVisibilityToggle: undefined,
});

export function DataTable<T>({
  columns,
  data,
  enableColumnVisibilityToggle = true,
  enableGlobalFilter = true,
  enablePagination = true,
  pageSize = 10,
  loading = false,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debounceValue, setDebounceValue] = useState(globalFilter ?? "");
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
      pagination,
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(debounceValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [debounceValue, setGlobalFilter]);

  return (
    <div className="static w-full space-y-4 overflow-auto">
      <ColumnVisibilityToggleContext.Provider value={{ enableColumnVisibilityToggle }}>
        <div className="grid items-start gap-2 sm:grid sm:grid-cols-1 sm:grid-rows-2 md:grid md:grid-cols-1 md:grid-rows-2 lg:flex lg:grid-cols-2 lg:grid-rows-1">
          {enableGlobalFilter && (
            <Input
              placeholder="Search from table..."
              value={debounceValue ?? ""}
              onChange={(event) => setDebounceValue(event.target.value)}
              className="lg:w-[25%]"
            />
          )}

          <DataTableToolbar table={table} />
        </div>
      </ColumnVisibilityToggleContext.Provider>

      <div className="rounded-md border px-2">
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
            {!loading ? (
              table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="max-w-[30rem] truncate">
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
              )
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex w-full items-center justify-center gap-2">
                    <LoadingSpinner /> <span className="text-lg">Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {enablePagination && (
        <div className="pt-4 pb-10">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
