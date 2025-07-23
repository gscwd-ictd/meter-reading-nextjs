"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@mr/components/ui/Button";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";
import { useContext } from "react";
import { ColumnVisibilityToggleContext } from "./data-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { enableColumnVisibilityToggle } = useContext(ColumnVisibilityToggleContext);

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        {table.getAllColumns().map((col, index) => {
          if (col.getCanFilter()) {
            return (
              <DataTableFacetedFilter
                key={index}
                column={col}
                title={col.columnDef.meta?.exportLabel ?? col.id}
              />
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
      {enableColumnVisibilityToggle && <DataTableViewOptions table={table} />}
    </div>
  );
}
