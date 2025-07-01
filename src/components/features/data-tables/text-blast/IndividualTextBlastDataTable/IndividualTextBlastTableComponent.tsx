import { FunctionComponent, Suspense } from "react";
import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { useIndividualTextBlastColumns } from "./IndividualTextBlastDataTableColumns";
import { IndividualTextBlastDataTable } from "./IndividualTextBlastDataTable";

export const IndividualTextBlastTableComponent: FunctionComponent = () => {
  const concessionaires = useTextBlastStore((state) => state.concessionaires);
  const individualTextBlastColumns = useIndividualTextBlastColumns(concessionaires);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <IndividualTextBlastDataTable data={concessionaires ?? []} columns={individualTextBlastColumns} />
      </Suspense>
    </>
  );
};
