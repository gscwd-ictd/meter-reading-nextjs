"use client";

import { FunctionComponent, ReactNode, Suspense } from "react";
import { useMeterReaderColumns } from "./MeterReaderColumns";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type MeterReaderDataTableProps = {
  actionBtn: ReactNode | ReactNode[];
};

export const MeterReaderDataTable: FunctionComponent<MeterReaderDataTableProps> = ({ actionBtn }) => {
  const { data: meterReaders, isFetching } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);

      return res.data;
    },
  });

  const meterReaderColumns = useMeterReaderColumns(meterReaders);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        title="Meter Readers"
        data={meterReaders ?? []}
        columns={meterReaderColumns}
        loading={isFetching}
        actionBtn={actionBtn}
      />
    </Suspense>
  );
};
