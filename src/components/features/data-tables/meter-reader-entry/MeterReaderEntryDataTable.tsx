"use client";

import { FunctionComponent, Suspense } from "react";
import { useMeterReaderEntryColumns } from "./MeterReaderEntryColumns";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { DataTable } from "@mr/components/ui/data-table/data-table";

export const MeterReaderEntryDataTable: FunctionComponent = () => {
  const meterReaders = useMeterReadersStore((state) => state.meterReaders);

  const meterReaderEntryColumns = useMeterReaderEntryColumns(meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={meterReaders ?? []} columns={meterReaderEntryColumns} />
    </Suspense>
  );
};
