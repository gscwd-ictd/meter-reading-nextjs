"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  Row,
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
import { FileX2, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@mr/lib/utils";
import { DataTableFilters } from "./data-table-filters";

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
  onRowClick?: (row: Row<T>) => void;
  emptyStateMessage?: string;
  rowClassName?: string | ((row: Row<T>) => string);

  // new filtering props
  enableColumnFilters?: boolean;
  columnFilterOptions?: {
    id: string;
    title: string;
    options: Array<{ label: string; value: string }>;
  }[];
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
  pageSize = 8,
  loading = false,
  actionBtn,
  onRowClick,
  title = "",
  emptyStateMessage = "No results found",
  rowClassName,
  enableColumnFilters = false,
  columnFilterOptions = [],
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
    <div className="flex h-full min-h-[24rem] flex-col space-y-4">
      <ColumnVisibilityToggleContext.Provider value={{ enableColumnVisibilityToggle }}>
        {/* Header Section with improved spacing */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            {!loading && data.length > 0 && (
              <span className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium">
                {data.length} items
              </span>
            )}
          </div>

          {/* Search and Actions - improved responsive layout */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {enableGlobalFilter && (
              <div className="relative">
                <Input
                  placeholder="Search..."
                  value={debounceValue ?? ""}
                  onChange={(event) => setDebounceValue(event.target.value)}
                  className="h-9 w-full sm:w-64 lg:w-80"
                />
              </div>
            )}
            {actionBtn && <div className="flex items-center gap-2">{actionBtn}</div>}
          </div>
        </div>

        {/* Toolbar Section */}
        <DataTableToolbar table={table} />
      </ColumnVisibilityToggleContext.Provider>

      {/* Main Table Container with improved scrolling */}
      <div className="bg-background relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border">
        {loading || !table.getRowModel().rows?.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            {loading ? (
              <>
                <LoadingSpinner className="text-primary h-12 w-12" />
                <p className="text-muted-foreground text-sm">Loading data...</p>
              </>
            ) : (
              <>
                <div className="bg-muted rounded-full p-4">
                  <FileX2 className="text-muted-foreground h-8 w-8" />
                </div>
                <div className="text-center">
                  <p className="text-foreground text-lg font-medium">{emptyStateMessage}</p>
                  {debounceValue && (
                    <p className="text-muted-foreground mt-1 text-sm">Try adjusting your search or filters</p>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full overflow-auto">
            <Table className="min-w-full">
              <TableHeader className="bg-background sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className={cn(
                          "h-10 px-4 py-1 text-xs font-medium tracking-wide text-gray-800",
                          header.column.getCanSort() && "hover:text-foreground cursor-pointer select-none",
                          header.column.getIsSorted() && "text-foreground",
                        )}
                      >
                        <div className="flex items-center">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                          {/* {header.column.getCanSort() && getSortIcon(header.column.getIsSorted())} */}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn(
                      "border-b transition-colors",
                      onRowClick && "hover:bg-muted/50 cursor-pointer",
                      rowClassName && typeof rowClassName === "string"
                        ? rowClassName
                        : typeof rowClassName === "function"
                          ? rowClassName(row)
                          : "",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-2 text-sm">
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

      {/* Pagination Section with improved styling */}
      {enablePagination && data.length > 0 && (
        <div className="pt-4">
          <DataTablePagination table={table} />
        </div>
      )}
    </div>
  );
}
