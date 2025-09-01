import { DataTable } from "@mr/components/ui/data-table/data-table";
import { FunctionComponent, ReactNode, Suspense, useEffect } from "react";
import { useReadingRemarksColumns } from "./ReadingRemarksColumns";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReadingRemark } from "@mr/lib/types/reading-remark";
import { useReadingRemarksStore } from "@mr/components/stores/useReadingRemarksStore";

type ReadingRemarksDataTableProps = {
  actionBtn: ReactNode | ReactNode[];
};

export const ReadingRemarksDataTable: FunctionComponent<ReadingRemarksDataTableProps> = ({ actionBtn }) => {
  const { data, refetch, isLoading } = useQuery({
    queryKey: ["get-all-reading-remarks"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/reading-remarks`); // should be areas

      return res.data as ReadingRemark[];
    },
  });

  const setRefetch = useReadingRemarksStore((state) => state.setRefetch);

  const readingRemarksColumns = useReadingRemarksColumns(data);

  useEffect(() => {
    if (data) setRefetch(refetch);
  }, [data, setRefetch, refetch]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DataTable
        columns={readingRemarksColumns}
        data={data ? data : []}
        loading={isLoading}
        title="Reading Remarks"
        actionBtn={actionBtn}
      />
    </Suspense>
  );
};
