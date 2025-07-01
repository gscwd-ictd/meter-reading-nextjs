"use client";

import { Table } from "@tanstack/react-table";
import { useContext, } from "react";
import { DataTableViewOptions } from "@/components/ui/data-table/data-table-view-options";
import { ColumnVisibilityToggleContext } from "./AreaTextBlastDataTable";
import { ZoneBookMonthDropdown } from "./ZoneBookMonthDropdown";

interface AreaTextBlastDataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function AreaTextBlastDataTableToolbar<TData>({ table }: AreaTextBlastDataTableToolbarProps<TData>) {
  const { enableColumnVisibilityToggle } = useContext(ColumnVisibilityToggleContext);

  return (
    <div className="mb-4 flex w-full items-center justify-between overflow-auto gap-2">
      <ZoneBookMonthDropdown />
      {enableColumnVisibilityToggle && <DataTableViewOptions table={table} />}
    </div>
  );
}
