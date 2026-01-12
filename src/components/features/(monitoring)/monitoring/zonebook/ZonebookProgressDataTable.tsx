"use client";

import { DataTable } from "@mr/components/ui/data-table/data-table";
import { FunctionComponent, ReactNode, Suspense, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useZonebookProgressColumns } from "./ZonebookProgressColumns";
import { ZonebookProgress } from "@mr/lib/types/zonebook";
import { useZonebookProgressStore } from "@mr/components/stores/useZonebookProgressStore";
import { format, parse } from "date-fns";
import { useSearchParams } from "next/navigation";
import { formatYearMonthToReadableDate } from "@mr/lib/functions/formatDate";

type ZonebookProgressDataTableProps = {
  actionBtn: ReactNode | ReactNode[];
};

export const ZonebookProgressDataTable: FunctionComponent<ZonebookProgressDataTableProps> = ({
  actionBtn,
}) => {
  const searchParams = useSearchParams();
  const setRefetch = useZonebookProgressStore((state) => state.setRefetch);
  const monthYear = useZonebookProgressStore((state) => state.monthYear);
  const setSelectedZonebookEntry = useZonebookProgressStore((state) => state.setSelectedZonebookEntry);
  const setZonebookProgressEntryDialogIsOpen = useZonebookProgressStore(
    (state) => state.setZonebookProgressEntryDialogIsOpen,
  );

  // Get date from URL or use current date
  const urlMonthYear = searchParams.get("date");

  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-zonebook-progress", monthYear],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/progress/zonebooks?date=${monthYear}`); // should be areas

      return res.data as ZonebookProgress[];
    },
    enabled: !!monthYear,
    retry: 2,
  });

  const zonebookProgressColumns = useZonebookProgressColumns(data);

  useEffect(() => {
    if (data) setRefetch(refetch);
  }, [data, setRefetch, refetch]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        data={data ? data : []}
        columns={zonebookProgressColumns}
        loading={isLoading}
        title={`Zonebook Progress  ${urlMonthYear ? `for ${formatYearMonthToReadableDate(urlMonthYear)}` : ""}`}
        actionBtn={actionBtn}
        enableGlobalFilter={false}
        pageSize={12}
        onRowClick={(row) => {
          setSelectedZonebookEntry(row.original);
          setZonebookProgressEntryDialogIsOpen(true);
        }}
      />
    </Suspense>
  );
};
