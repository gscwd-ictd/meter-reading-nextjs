"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { DataTable } from "@mr/components/ui/data-table/data-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAreasColumns } from "./AreasColumns";
import { Area } from "@mr/lib/types/zonebook";
import { useZonebookStore } from "@mr/components/stores/useZonebookStore";
import { Button } from "@mr/components/ui/Button";
import { CirclePlusIcon } from "lucide-react";

export const AreasDataTable: FunctionComponent = () => {
  const setRefetchAreas = useZonebookStore((state) => state.setRefetchAreas);
  const setAddAreaDialogIsOpen = useZonebookStore((state) => state.setAddAreaDialogIsOpen);

  const { data, refetch, isLoading } = useQuery({
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

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        title="Areas"
        data={data ? data : []}
        columns={areaColumns}
        loading={isLoading}
        actionBtn={
          <Button
            className="flex w-full lg:w-fit dark:text-white"
            onClick={() => setAddAreaDialogIsOpen(true)}
          >
            <CirclePlusIcon /> Add Area
          </Button>
        }
      />
    </Suspense>
  );
};
