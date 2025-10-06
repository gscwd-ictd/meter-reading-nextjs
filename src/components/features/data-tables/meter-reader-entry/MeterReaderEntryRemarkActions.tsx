import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Button } from "@mr/components/ui/Button";
import { MeterReaderWithZonebooks } from "@mr/lib/types/personnel";
import { Reassignment } from "@mr/lib/types/zonebook";
import { FunctionComponent } from "react";

type MeterReaderEntryRemarkActionsProps = {
  meterReader: MeterReaderWithZonebooks;
};

export const MeterReaderEntryRemarkActions: FunctionComponent<MeterReaderEntryRemarkActionsProps> = ({
  meterReader,
}) => {
  const setOpen = useSchedulesStore((state) => state.setReassignmentRemarksDialogIsOpen);
  const setSelectedMeterReader = useSchedulesStore((state) => state.setSelectedMeterReader);

  const openReassignmentRemarksDialog = (meterReader: MeterReaderWithZonebooks) => {
    setSelectedMeterReader(meterReader);
    setOpen(true);
  };

  return (
    <>
      {meterReader.reassignment?.remarks === undefined ||
      meterReader.reassignment?.remarks === "" ||
      !meterReader.reassignment.remarks ? (
        <span className="text-muted-foreground text-xs">N/A</span>
      ) : (
        <Button onClick={() => openReassignmentRemarksDialog(meterReader)} variant="outline">
          <span className="text-xs dark:text-white">{meterReader.reassignment?.remarks}</span>
        </Button>
      )}
    </>
  );
};
