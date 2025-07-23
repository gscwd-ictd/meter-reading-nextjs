"use client";

import { FunctionComponent, Suspense } from "react";
import { usePersonnelColumns } from "./PersonnelColumns";
import { usePersonnelStore } from "@mr/components/stores/usePersonnelStore";
import { DataTable } from "@mr/components/ui/data-table/data-table";

export const PersonnelDataTable: FunctionComponent = () => {
  const meterReaders = usePersonnelStore((state) => state.meterReaders);

  const personnelColumns = usePersonnelColumns(meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={meterReaders ?? []} columns={personnelColumns} />
    </Suspense>
  );
};
