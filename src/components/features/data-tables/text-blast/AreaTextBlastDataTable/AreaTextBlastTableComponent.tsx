import { FunctionComponent, Suspense } from "react";
import { useAreaTextBlastColumns } from "./AreaTextBlastDataTableColumns";
import { AreaTextBlastDataTable } from "./AreaTextBlastDataTable";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";

export const AreaTextBlastTableComponent: FunctionComponent = () => {
  const areaTextBlastColumns = useAreaTextBlastColumns();
  const selectedConsumers = useTextBlastStore((state) => state.selectedConsumers);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <AreaTextBlastDataTable data={selectedConsumers ?? []} columns={areaTextBlastColumns} />
      </Suspense>
    </>
  );
};
