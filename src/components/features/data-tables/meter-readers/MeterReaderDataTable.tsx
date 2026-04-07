"use client";

import { FunctionComponent, ReactNode, Suspense, useEffect } from "react";
import { useMeterReaderColumns } from "./MeterReaderColumns";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

type MeterReaderDataTableProps = {
  actionBtn: ReactNode | ReactNode[];
};

export const MeterReaderDataTable: FunctionComponent<MeterReaderDataTableProps> = ({ actionBtn }) => {
  const {
    data: meterReaders,
    isFetching,
    isError,
    failureCount,
  } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);

      return res.data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
  });
  const meterReaderColumns = useMeterReaderColumns(meterReaders);

  // show toast when failure is met
  useEffect(() => {
    if (isError && failureCount >= 2)
      toast.error("Error", {
        description: "Cannot fetch meter readers. Please try again in a few seconds",
        position: "top-right",
      });
  }, [failureCount, isError]);

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
