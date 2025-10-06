import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Badge } from "@mr/components/ui/Badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { format } from "date-fns";
import { ArrowRightCircleIcon, LightbulbIcon } from "lucide-react";
import { FunctionComponent } from "react";

export const MeterReaderZonebookReassignmentDialog: FunctionComponent = () => {
  const open = useSchedulesStore((state) => state.reassignmentRemarksDialogIsOpen);
  const setOpen = useSchedulesStore((state) => state.setReassignmentRemarksDialogIsOpen);
  const selectedMeterReader = useSchedulesStore((state) => state.selectedMeterReader);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary text-xl font-semibold dark:text-white">
              Reassigned to Default Zonebooks
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm">
              <span className="flex gap-2 space-y-0">
                <span>{selectedMeterReader?.name}</span>
                <Badge className="px-1 tracking-tighter dark:text-white">
                  {format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")}
                </Badge>{" "}
                <Badge variant="secondary" className="dark:text-white">
                  {format(selectedScheduleEntry?.readingDate!, "EEEE")}
                </Badge>
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-start gap-2 rounded border border-dashed bg-gray-100 p-2 text-xs dark:bg-transparent">
              <LightbulbIcon className="shrink-0 text-yellow-400/60 dark:text-yellow-400" />
              <span className="leading-4 tracking-normal">
                The following{" "}
                {selectedMeterReader?.reassignment?.zoneBooks &&
                selectedMeterReader?.reassignment?.zoneBooks.length > 0 &&
                selectedMeterReader?.reassignment?.zoneBooks.length === 1
                  ? "zone & book has "
                  : selectedMeterReader?.reassignment?.zoneBooks &&
                      selectedMeterReader?.reassignment?.zoneBooks.length > 0 &&
                      selectedMeterReader?.reassignment?.zoneBooks.length > 1
                    ? "zone & books have "
                    : ""}{" "}
                been reassigned to the selected meter reader&apos;s default zonebooks. Please use the zonebook
                selector to confirm the assignment if it hasn't been completed manually.
              </span>
            </div>

            <div className="text-primary text-xs font-bold">Reassigned</div>
            {selectedMeterReader?.reassignment?.zoneBooks &&
              selectedMeterReader?.reassignment?.zoneBooks.length > 0 &&
              selectedMeterReader?.reassignment?.zoneBooks.map((zb, idx) => {
                return (
                  <div
                    key={idx}
                    className="flex w-full items-center justify-between gap-2 rounded border p-4 text-sm"
                  >
                    Zone {zb.zone} - Book {zb.book} <ArrowRightCircleIcon className="text-primary" />{" "}
                    {zb.meterReader.name}
                  </div>
                );
              })}

            <div className="flex flex-col gap-1">
              <div className="text-primary text-xs font-bold">Remarks</div>
              <div className="text-sm">{selectedMeterReader?.reassignment.remarks}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
