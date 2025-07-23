"use client";

import { FunctionComponent, Suspense, useCallback, useState } from "react";
import { BatchPostPostedDataTable } from "./BatchPostPostedDataTable";
import { useBatchPostPostedColumns } from "./BatchPostPostedDataTableColumns";
import { useBatchPostStore } from "@mr/components/stores/useBatchPostStore";
import { Dialog } from "@mr/components/ui/Dialog";
import ViewMeterReadingDetails from "@mr/components/features/batch-post/ViewMeterReadingDetails";
import { ReadingDetails } from "@mr/lib/types/text-blast/ReadingDetails";

export const BatchPostPostedTableComponent: FunctionComponent = () => {
  const postedReadConsumers = useBatchPostStore((state) => state.postedReadConsumers);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReadingDetails | null>(null);

  const handleViewDetails = useCallback((row: ReadingDetails) => {
    setSelectedRow(row);
    setOpenDialog(true);
  }, []);

  const batchPostPostedColumns = useBatchPostPostedColumns(postedReadConsumers, handleViewDetails);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <BatchPostPostedDataTable data={postedReadConsumers ?? []} columns={batchPostPostedColumns} />
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <ViewMeterReadingDetails data={selectedRow} />
        </Dialog>
      </Suspense>
    </>
  );
};
