"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@mr/components/ui/Button";
import { BatchPostListDataTableFacetedFilter } from "./BatchPostPostedDataTableFacetedFilter";
import { Input } from "@mr/components/ui/Input";
import { useContext, useEffect, useState } from "react";
import { Label } from "@mr/components/ui/Label";
import { DataTableViewOptions } from "@mr/components/ui/data-table/data-table-view-options";
import { ColumnVisibilityToggleContext } from "./BatchPostPostedDataTable";

interface BatchPostPostedDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BatchPostPostedDataTableToolbar<TData>({ table }: BatchPostPostedDataTableToolbarProps<TData>) {
  const { enableColumnVisibilityToggle } = useContext(ColumnVisibilityToggleContext);

  const isFiltered = table.getState().columnFilters.length > 0;

  const [globalFilter, setGlobalFilter] = useState("");
  const [debounceValue, setDebounceValue] = useState(globalFilter ?? "");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(debounceValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [debounceValue, setGlobalFilter]);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {table.getAllColumns().map((col) => {
          if (col.getCanFilter()) {
            // Default faceted filter
            if (
              col.id !== "dueDate" &&
              col.id !== "disconnectionDate" &&
              col.id !== "readingDate" &&
              col.id !== "datePosted"
            ) {
              return (
                <BatchPostListDataTableFacetedFilter
                  key={col.id}
                  column={col}
                  title={col.columnDef.meta?.exportLabel ?? col.id}
                />
              );
            }

            // Filter for date/s
            return (
              <div key={col.id} className="flex flex-row items-center gap-2 whitespace-nowrap">
                <Label htmlFor={col.id}>{col.columnDef.meta?.exportLabel ?? col.id}</Label>
                <Input
                  type="date"
                  id={col.id}
                  value={(col.getFilterValue() as string) || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    col.setFilterValue(value || undefined);
                    setDebounceValue(value);
                  }}
                />
              </div>
            );
          }
        })}

        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}

        {enableColumnVisibilityToggle && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
