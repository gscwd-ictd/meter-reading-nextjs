"use client";

import { FunctionComponent, Suspense } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { useZonebookColumns } from "./ZonebookColumns";

export const ZonebookDataTable: FunctionComponent = () => {
  const zonebooks = useZonebookStore((state) => state.zonebooks);

  const zonebookColumns = useZonebookColumns(zonebooks);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={zonebooks ?? []} columns={zonebookColumns} />
    </Suspense>
  );
};
