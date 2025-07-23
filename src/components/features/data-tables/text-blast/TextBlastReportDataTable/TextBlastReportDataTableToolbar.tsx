"use client";

import { Table } from "@tanstack/react-table";
import { useContext } from "react";
import { DataTableViewOptions } from "@mr/components/ui/data-table/data-table-view-options";
import { ColumnVisibilityToggleContext } from "./TextBlastReportDataTable";
import { DateRangeFilter } from "../../DateRangeFilter";
import { Button } from "@mr/components/ui/Button";
import { Cross2Icon } from "@radix-ui/react-icons";

interface TextBlastReportDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function TextBlastReportDataTableToolbar<TData>({
  table,
}: TextBlastReportDataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { enableColumnVisibilityToggle } = useContext(ColumnVisibilityToggleContext);
  const dateCreatedColumn = table.getColumn("dateCreated");

  return (
    <div className="flex w-full items-center justify-between">
      {dateCreatedColumn && <DateRangeFilter column={dateCreatedColumn} />}
      {isFiltered && (
        <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="px-2 lg:px-3">
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
      {enableColumnVisibilityToggle && <DataTableViewOptions table={table} />}
    </div>
  );
}
