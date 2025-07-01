"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/Button";
import { BatchPostListDataTableFacetedFilter } from "./BatchPostListDataTableFacetedFilter";
import { Input } from "@/components/ui/Input";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/Label";

interface BatchPostListDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function BatchPostListDataTableToolbar<TData>({ table }: BatchPostListDataTableToolbarProps<TData>) {
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
            if (col.id !== "dueDate" && col.id !== "disconnectionDate" && col.id !== "readingDate") {
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
      </div>
    </div>
  );
}
