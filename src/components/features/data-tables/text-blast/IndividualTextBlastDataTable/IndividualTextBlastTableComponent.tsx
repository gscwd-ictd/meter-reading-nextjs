import { FunctionComponent, Suspense } from "react";
import { useIndividualTextBlastColumns } from "./IndividualTextBlastDataTableColumns";
import { IndividualTextBlastDataTable } from "./IndividualTextBlastDataTable";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ReadingDetails, Zonebook } from "@/lib/types/text-blast/ReadingDetails";

export const IndividualTextBlastTableComponent: FunctionComponent = () => {
  const individualTextBlastColumns = useIndividualTextBlastColumns();

  const { data } = useQuery<Zonebook>({
    queryKey: ["get-all-read-accounts-by-current-date"],
    queryFn: async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_HOST}/meter-readers/cmcisxft004jmsy58bxkb03nf00bq/schedule-reading`,
      );

      return response.data.zoneBooks;
    },
  });

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <IndividualTextBlastDataTable data={data ?? []} columns={individualTextBlastColumns} />
      </Suspense>
    </>
  );
};
