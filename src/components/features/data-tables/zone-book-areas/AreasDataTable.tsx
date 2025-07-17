"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useAreasColumns } from "./AreasColumns";
import { Area } from "@mr/lib/types/zonebook";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";

export const AreasDataTable: FunctionComponent = () => {
  const setRefetchAreas = useZonebookStore((state) => state.setRefetchAreas);

  const { data, refetch } = useQuery({
    queryKey: ["get-all-zoneBooks"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/area`); // should be areas

      return res.data as Area[];
    },
  });

  const areaColumns = useAreasColumns(data);

  useEffect(() => {
    if (data) setRefetchAreas(refetch);
  }, [data, setRefetchAreas, refetch]);

  if (!data)
    return (
      <div className="text-primary flex h-full w-full items-center justify-center gap-2">
        <LoadingSpinner size={50} /> Loading Zonebooks...
      </div>
    );
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable data={data ? data : []} columns={areaColumns} />
    </Suspense>
  );
};
