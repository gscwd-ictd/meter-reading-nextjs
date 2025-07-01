"use client";

import { FunctionComponent, Suspense, useCallback, useState } from "react";
import { BatchPostPostedDataTable } from "./BatchPostPostedDataTable";
import { useBatchPostPostedColumns } from "./BatchPostPostedDataTableColumns";
import { useBatchPostStore } from "@/components/stores/useBatchPostStore";
import { Dialog } from "@/components/ui/Dialog";
import ViewMeterReadingDetails from "@/components/features/batch-post/ViewMeterReadingDetails";
import { BatchPost } from "@/lib/types/batch-post";

export const BatchPostPostedTableComponent: FunctionComponent = () => {
  const batchPostPostedConcessionaires = useBatchPostStore((state) => state.batchPostPostedConcessionaires);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BatchPost | null>(null);

  const handleViewDetails = useCallback((row: BatchPost) => {
    setSelectedRow(row);
    setOpenDialog(true);
  }, []);

  const batchPostPostedColumns = useBatchPostPostedColumns(batchPostPostedConcessionaires, handleViewDetails);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <BatchPostPostedDataTable
          data={batchPostPostedConcessionaires ?? []}
          columns={batchPostPostedColumns}
        />
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <ViewMeterReadingDetails data={selectedRow} />
        </Dialog>
      </Suspense>
    </>
  );
};
