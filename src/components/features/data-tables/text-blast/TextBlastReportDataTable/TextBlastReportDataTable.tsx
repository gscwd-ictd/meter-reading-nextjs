"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { Heading } from "@mr/components/features/typography/Heading";
import { Badge } from "@mr/components/ui/Badge";
import { createContext, useEffect, useState } from "react";
import { Input } from "@mr/components/ui/Input";
import { FileX2, SearchIcon } from "lucide-react";
import { TextBlastReportDataTableToolbar } from "./TextBlastReportDataTableToolbar";

interface TextBlastReportDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  enableGlobalFilter?: boolean;
  data: TData[];
  enableColumnVisibilityToggle?: boolean;
}

type ColumnVisibilityToggleContextState = {
  enableColumnVisibilityToggle?: boolean;
};

export const ColumnVisibilityToggleContext = createContext<ColumnVisibilityToggleContextState>({
  enableColumnVisibilityToggle: undefined,
});

export function TextBlastReportDataTable<TData, TValue>({
  columns,
  data,
  enableGlobalFilter = true,
  enableColumnVisibilityToggle = true,
}: TextBlastReportDataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debounceValue, setDebounceValue] = useState(globalFilter ?? "");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    filterFns: {
      dateBetween: (row, columnId, filterValue) => {
        const rawDate = row.getValue(columnId);
        const [start, end] = filterValue;

        if (!rawDate) return false;

        if (start && end) {
          return rawDate >= start && rawDate <= end;
        }

        if (start) {
          return rawDate >= start;
        }

        if (end) {
          return rawDate <= end;
        }

        return true;
      },
    },
    state: {
      sorting,
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
    <>
      <ColumnVisibilityToggleContext.Provider value={{ enableColumnVisibilityToggle }}>
        <div className="mb-4 overflow-auto">
          <div className="flex items-center gap-2">
            {enableGlobalFilter && (
              <div className="relative flex w-96 items-center">
                <Input
                  placeholder="Search from table..."
                  value={debounceValue ?? ""}
                  onChange={(event) => setDebounceValue(event.target.value)}
                  className="min-w-96 pl-10"
                />
                <div className="absolute left-3 text-gray-400">
                  <SearchIcon className="h-5 w-5" />
                </div>
              </div>
            )}

            <TextBlastReportDataTableToolbar table={table} />
          </div>
        </div>
      </ColumnVisibilityToggleContext.Provider>

      <div className="h-[630px] overflow-scroll rounded-md border-1 border-gray-200">
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
      <div className="my-4 flex flex-row items-center justify-end gap-2">
        <Heading variant={"h4"}>Total Contacts</Heading>
        <Badge className="px-3">
          <p className="text-lg">{table.getRowModel().rows?.length ?? 0}</p>
        </Badge>
      </div>
    </>
  );
}
