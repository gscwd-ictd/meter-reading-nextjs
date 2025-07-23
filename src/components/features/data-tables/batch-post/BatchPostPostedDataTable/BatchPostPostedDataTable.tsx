import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { createContext, useEffect, useState } from "react";
import { Input } from "@mr/components/ui/Input";
import { DataTablePagination } from "@mr/components/ui/data-table/data-table-pagination";
import { BatchPostPostedDataTableToolbar } from "./BatchPostPostedDataTableToolbar";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { FileX2 } from "lucide-react";

interface BatchPostPostedDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableColumnVisibilityToggle?: boolean;
  enableGlobalFilter?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  loading?: boolean;
}

type ColumnVisibilityToggleContextState = {
  enableColumnVisibilityToggle?: boolean;
};

export const ColumnVisibilityToggleContext = createContext<ColumnVisibilityToggleContextState>({
  enableColumnVisibilityToggle: undefined,
});

export function BatchPostPostedDataTable<TData, TValue>({
  columns,
  data,
  enableColumnVisibilityToggle = true,
  enableGlobalFilter = true,
  enablePagination = true,
  pageSize = 10,
  loading = false,
}: BatchPostPostedDataTableProps<TData, TValue>) {
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
    <div className="space-y-4">
      <ColumnVisibilityToggleContext.Provider value={{ enableColumnVisibilityToggle }}>
        <div className="mb-4 overflow-auto">
          <div className="flex items-center gap-2">
            {enableGlobalFilter && (
              <div className="relative flex w-96 items-center">
                <Input
                  placeholder="Search from table..."
                  value={debounceValue ?? ""}
                  onChange={(event) => setDebounceValue(event.target.value)}
                  className="min-w-96"
                />
              </div>
            )}

            <BatchPostPostedDataTableToolbar table={table} />
          </div>
        </div>
      </ColumnVisibilityToggleContext.Provider>

      <div className="overflow-auto rounded-md border">
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
