import { useReadingRemarksStore } from "@mr/components/stores/useReadingRemarksStore";
import { ReadingRemark } from "@mr/lib/types/reading-remark";
import { SquarePenIcon } from "lucide-react";
import { FunctionComponent } from "react";

type ReadingRemarksRowActionsProps = {
  details: ReadingRemark;
};

export const ReadingRemarksRowActions: FunctionComponent<ReadingRemarksRowActionsProps> = ({ details }) => {
  const setEditReadingRemarksDialogIsOpen = useReadingRemarksStore(
    (state) => state.setEditReadingRemarksDialogIsOpen,
  );
  const setSelectedReadingRemark = useReadingRemarksStore((state) => state.setSelectedReadingRemark);

  return (
    <>
      <div className="flex gap-2">
        <SquarePenIcon
          className="bg-primary size-8 rounded p-2 text-white hover:cursor-pointer"
          role="button"
          onClick={() => {
            setEditReadingRemarksDialogIsOpen(true);
            setSelectedReadingRemark(details);
          }}
        />

        {/* <DeleteBillingAdjustmentsDialog details={details} /> */}
      </div>
    </>
  );
};
