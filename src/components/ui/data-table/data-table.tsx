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
import { createContext, ReactNode, useEffect, useState } from "react";
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
  actionBtn?: ReactNode | ReactNode[];
  title: string;
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
  actionBtn,
  title = "",
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
    }, 500);

    return () => clearTimeout(timeout);
  }, [debounceValue, setGlobalFilter]);

  return (
    <div className="flex h-full min-h-[22rem] flex-col space-y-4">
      <ColumnVisibilityToggleContext.Provider value={{ enableColumnVisibilityToggle }}>
        {/* Right-aligned: Search + Actions (flexible for mobile) */}
        <div className="grid grid-cols-1 items-start gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          <h3 className="order-1 text-xl font-bold">{title}</h3>

          {/* Search Input (full width on mobile, fixed width on desktop) */}
          <div className="order-2 flex flex-col justify-end gap-2 sm:flex-col md:flex-col lg:flex-row">
            {enableGlobalFilter && (
              <Input
                placeholder="Search..."
                value={debounceValue ?? ""}
                onChange={(event) => setDebounceValue(event.target.value)}
                className="order-2 sm:order-2 sm:w-full md:order-2 md:w-full lg:order-1 lg:w-64" // Fixed width on desktop
              />
            )}

            {actionBtn && (
              <div className="order-1 flex justify-end sm:order-1 md:order-1 lg:order-2">{actionBtn}</div>
            )}
          </div>

          <div className="order-3" />

          <div className="order-4 col-span-full">
            <DataTableToolbar table={table} />
          </div>
        </div>
      </ColumnVisibilityToggleContext.Provider>

      <div className="flex min-h-0 flex-1 flex-col overflow-auto rounded-md border">
        {loading || !table.getRowModel().rows?.length ? (
          <div className="flex flex-1 items-center justify-center">
            {loading ? (
              <LoadingSpinner className="text-primary size-20" />
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FileX2 className="text-muted-foreground h-7 w-7 dark:text-white" />
                <span className="text-muted-foreground text-2xl font-extrabold tracking-wide dark:text-white">
                  No Results
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <Table className="min-w-full [&_td]:px-4 [&_th]:px-4">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="max-w-[30rem] truncate">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {enablePagination && (
        <div className="pt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
