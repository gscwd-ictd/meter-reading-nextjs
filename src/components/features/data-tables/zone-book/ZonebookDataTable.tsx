"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useZonebookColumns } from "./ZonebookColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

export const ZonebookDataTable: FunctionComponent = () => {
  const zoneBooks = useZonebookStore((state) => state.zoneBooks);
  const setZonebooks = useZonebookStore((state) => state.setZonebooks);

  const { data } = useQuery({
    queryKey: ["get-all-zoneBooks"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/zone-book`);

      return res.data;
    },
  });

  const zonebookColumns = useZonebookColumns(zoneBooks);

  useEffect(() => {
    if (data) setZonebooks(data);
  }, [data, setZonebooks]);

  if (!data)
    return (
      <div className="text-primary flex h-full w-full items-center justify-center gap-2">
        <LoadingSpinner size={50} /> Loading Zonebooks...
      </div>
    );
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={zoneBooks ? zoneBooks : []} columns={zonebookColumns} />
    </Suspense>
  );
};
