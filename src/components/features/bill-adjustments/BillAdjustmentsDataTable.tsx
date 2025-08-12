"use client";

import { DataTable } from "@mr/components/ui/data-table/data-table";
import { FunctionComponent, Suspense, useEffect } from "react";
import { useBillAdjustmentsColumns } from "./BillAdjustmentsColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BillAdjustment } from "@mr/lib/types/bill-adjustments";
import { useBillAdjustmentsStore } from "@mr/components/stores/useBillAdjustmentsStore";

export const BillAdjustmentsDataTable: FunctionComponent = () => {
  const setRefetch = useBillAdjustmentsStore((state) => state.setRefetch);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-bill-adjustments"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/bill-adjustments`); // should be areas

      return res.data as BillAdjustment[];
    },
  });

  const billAdjustmentColumns = useBillAdjustmentsColumns(data);

  useEffect(() => {
    if (data) setRefetch(refetch);
  }, [data, setRefetch, refetch]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        data={data ? data : []}
        columns={billAdjustmentColumns}
        loading={isLoading}
        title="Bill Adjustments"
      />
    </Suspense>
  );
};
