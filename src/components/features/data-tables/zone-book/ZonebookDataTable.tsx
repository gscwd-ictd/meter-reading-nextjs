"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useZonebookColumns } from "./ZonebookColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

export const ZonebookDataTable: FunctionComponent = () => {
  const zoneBooks = useZonebookStore((state) => state.zoneBooks);
  const setZonebooks = useZonebookStore((state) => state.setZonebooks);
  const setRefetchZonebooks = useZonebookStore((state) => state.setRefetchZonebooks);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-zoneBooks"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`);

      return res.data;
    },
  });

  const zonebookColumns = useZonebookColumns(zoneBooks);

  useEffect(() => {
    if (data) {
      setZonebooks(data);
      setRefetchZonebooks(refetch);
    }
  }, [data, setZonebooks, setRefetchZonebooks, refetch]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={zoneBooks ? zoneBooks : []} columns={zonebookColumns} loading={isLoading} />
    </Suspense>
  );
};
