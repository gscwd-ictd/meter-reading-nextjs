"use client";

import { FunctionComponent, Suspense, useCallback, useState } from "react";
import { useBatchPostColumns } from "./BatchPostListDataTableColumns";
import { useBatchPostStore } from "@/components/stores/useBatchPostStore";
import { BatchPostListDataTable } from "./BatchPostListDataTable";
import { BatchPost } from "@/lib/types/batch-post";
import { Dialog } from "@/components/ui/Dialog";
import ViewMeterReadingDetails from "@/components/features/batch-post/ViewMeterReadingDetails";

export const BatchPostTableComponent: FunctionComponent = () => {
  const concessionaires = useBatchPostStore((state) => state.concessionaires);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<BatchPost | null>(null);

  const handleViewDetails = useCallback((row: BatchPost) => {
    setSelectedRow(row);
    setOpenDialog(true);
  }, []);

  const batchPostColumns = useBatchPostColumns(concessionaires, handleViewDetails);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <BatchPostListDataTable data={concessionaires ?? []} columns={batchPostColumns} />
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <ViewMeterReadingDetails data={selectedRow} />
        </Dialog>
      </Suspense>
    </>
  );
};
