"use client";

import { FunctionComponent, Suspense } from "react";
import { useMeterReaderEntryColumns } from "./MeterReaderEntryColumns";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { DataTable } from "@mr/components/ui/data-table/data-table";

export const MeterReaderEntryDataTable: FunctionComponent = () => {
  const meterReaders = useMeterReadersStore((state) => state.meterReaders);

  // const { data: meterReaders } = useQuery({
  //   queryKey: ["get-all-meter-readers"],
  //   queryFn: async () => {
  //     const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/personnel?status=assigned`);

  //     return res.data;
  //   },
  // });

  const meterReaderEntryColumns = useMeterReaderEntryColumns(meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={meterReaders ?? []} columns={meterReaderEntryColumns} />
    </Suspense>
  );
};
