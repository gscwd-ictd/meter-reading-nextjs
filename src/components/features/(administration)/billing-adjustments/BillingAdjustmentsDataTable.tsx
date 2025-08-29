"use client";

import { DataTable } from "@mr/components/ui/data-table/data-table";
import { FunctionComponent, ReactNode, Suspense, useEffect } from "react";
import { useBillAdjustmentsColumns } from "./BillingAdjustmentsColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BillingAdjustment } from "@mr/lib/types/billing-adjustment";
import { useBillingAdjustmentsStore } from "@mr/components/stores/useBillingAdjustmentsStore";

type BillingAdjustmentsDataTableProps = {
  actionBtn: ReactNode | ReactNode[];
};

export const BillingAdjustmentsDataTable: FunctionComponent<BillingAdjustmentsDataTableProps> = ({
  actionBtn,
}) => {
  const setRefetch = useBillingAdjustmentsStore((state) => state.setRefetch);

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-bill-adjustments"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/billing-adjustments`); // should be areas

      return res.data as BillingAdjustment[];
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
        title="Billing Adjustments"
        actionBtn={actionBtn}
      />
    </Suspense>
  );
};
