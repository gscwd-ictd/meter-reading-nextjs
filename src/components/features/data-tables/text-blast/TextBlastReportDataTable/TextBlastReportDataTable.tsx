"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@mr/components/ui/Table";
import { Heading } from "@mr/components/features/typography/Heading";
import { Badge } from "@mr/components/ui/Badge";
import { useEffect, useState } from "react";
import { Input } from "@mr/components/ui/Input";
import { SearchIcon } from "lucide-react";
import { Label } from "@mr/components/ui/Label";
import { Combobox } from "@mr/components/ui/Combobox";
import { Button } from "@mr/components/ui/Button";

interface TextBlastReportDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  enableGlobalFilter?: boolean;
  data: TData[];
}

export function TextBlastReportDataTable<TData, TValue>({
  columns,
  data,
  enableGlobalFilter = true,
}: TextBlastReportDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [debounceValue, setDebounceValue] = useState(globalFilter ?? "");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
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
      <div className="flex flex-row items-center justify-between gap-2 pb-4">
        {enableGlobalFilter && (
          <div className="relative flex w-full items-center">
            <Input
              placeholder="Search from table..."
              value={debounceValue ?? ""}
              onChange={(event) => setDebounceValue(event.target.value)}
              className="pl-10"
            />
            <div className="absolute left-3 text-gray-400">
              <SearchIcon className="h-5 w-5" />
            </div>
          </div>
        )}

        <div className="flex flex-row gap-2">
          <Label htmlFor="from" className="whitespace-nowrap">
            From
          </Label>
          <Input type="date" name="from" />
        </div>

        <div className="flex flex-row gap-2">
          <Label htmlFor="to" className="whitespace-nowrap">
            To
          </Label>
          <Input type="date" name="to" />
        </div>

        <Combobox data={[]} text={"Status"} />

        <div className="flex justify-end">
          <Button variant={"default"} className="w-fit">
            Generate
          </Button>
        </div>
      </div>

      <div className="rounded-md border-1 border-gray-200 h-[630px] overflow-scroll">
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
      <div className="flex flex-row gap-2 items-center justify-end my-4">
        <Heading variant={"h4"}>Total Contacts</Heading>
        <Badge className="px-3">
          <p className="text-lg">{table.getRowModel().rows?.length ?? 0}</p>
        </Badge>
      </div>
    </>
  );
}
