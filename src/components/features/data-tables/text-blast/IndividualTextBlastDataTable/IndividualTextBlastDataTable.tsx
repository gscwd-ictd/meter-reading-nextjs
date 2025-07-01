"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Input } from "@/components/ui/Input";
import { createContext, useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { FileX2 } from "lucide-react";
import { IndividualTextBlastDataTableToolbar } from "./IndividualTextBlastDataTableToolbar";
import { Badge } from "@/components/ui/Badge";

type IndividualTextBlastDataTableProps<T> = {
  columns: Array<ColumnDef<T, unknown>>;
  data: T[];
  enableColumnVisibilityToggle?: boolean;
  enableGlobalFilter?: boolean;
  loading?: boolean;
};

type ColumnVisibilityToggleContextState = {
  enableColumnVisibilityToggle?: boolean;
};

export const ColumnVisibilityToggleContext = createContext<ColumnVisibilityToggleContextState>({
  enableColumnVisibilityToggle: undefined,
});

export function IndividualTextBlastDataTable<T>({
  columns,
  data,
  enableColumnVisibilityToggle = true,
  enableGlobalFilter = true,
  loading = false,
}: IndividualTextBlastDataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debounceValue, setDebounceValue] = useState(globalFilter ?? "");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      rowSelection,
      columnFilters,
      globalFilter,
    },
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(debounceValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [debounceValue, setGlobalFilter]);

  return (
    <div>
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

            <IndividualTextBlastDataTableToolbar table={table} />
          </div>
        </div>
      </ColumnVisibilityToggleContext.Provider>

      <div>
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
        <div className="pt-4 pb-10">
          <div className="flex h-10 items-center justify-between px-2">
            <div className="flex flex-row items-center justify-end gap-2">
              <p className="text-lg font-semibold">Total Contacts</p>
              <Badge
                className="px-3"
                variant={`${table.getSelectedRowModel().rows.length > 0 ? "default" : "outline"}`}
              >
                <p className="text-lg">{table.getSelectedRowModel().rows.length ?? 0}</p>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
