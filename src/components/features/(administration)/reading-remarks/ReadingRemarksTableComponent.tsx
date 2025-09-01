"use client";
import { useState } from "react";
import { AddReadingRemarksDialog } from "./AddReadingRemarksDialog";
import { ReadingRemarksDataTable } from "./ReadingRemarksDataTable";
import { EditReadingRemarksDialog } from "./EditReadingRemarksDialog";
import { useReadingRemarksStore } from "@mr/components/stores/useReadingRemarksStore";

export const ReadingRemarksTableComponent = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { editReadingRemarksDialogIsOpen, setEditReadingRemarksDialogIsOpen, selectedReadingRemark } =
    useReadingRemarksStore();

  return (
    <div className="mt-4">
      <EditReadingRemarksDialog
        open={editReadingRemarksDialogIsOpen}
        setOpen={setEditReadingRemarksDialogIsOpen}
        readingRemark={selectedReadingRemark}
      />
      <ReadingRemarksDataTable actionBtn={<AddReadingRemarksDialog open={open} setOpen={setOpen} />} />
    </div>
  );
};
