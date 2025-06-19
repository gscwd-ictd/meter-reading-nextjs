"use client";

import { FunctionComponent, Suspense } from "react";
import { useMeterReaderColumns } from "./MeterReaderColumns";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const MeterReaderDataTable: FunctionComponent = () => {
  const { data: meterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);

      return res.data;
    },
  });

  const meterReaderColumns = useMeterReaderColumns(meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={meterReaders ?? []} columns={meterReaderColumns} />
    </Suspense>
  );
};
