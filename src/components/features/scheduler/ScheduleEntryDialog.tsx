import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@mr/components/ui/Dialog";
import { format } from "date-fns";
import { FunctionComponent } from "react";
import { MeterReaderDataTable } from "../data-tables/meter-readers/MeterReaderDataTable";
import { Button } from "@mr/components/ui/Button";

export const ScheduleEntryDialog: FunctionComponent = () => {
  const scheduleEntryDialogIsOpen = useSchedulesStore((state) => state.scheduleEntryDialogIsOpen);
  const setScheduleEntryDialogIsOpen = useSchedulesStore((state) => state.setScheduleEntryDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const schedule = useSchedulesStore((state) => state.schedule);
  const setSchedule = useSchedulesStore((state) => state.setSchedule);

  if (selectedScheduleEntry !== null)
    return (
      <Dialog open={scheduleEntryDialogIsOpen} onOpenChange={setScheduleEntryDialogIsOpen} modal>
        <DialogContent className="min-w-[50%] sm:w-full lg:min-w-[50%] max-h-[90%]">
          <DialogHeader>
            <DialogTitle>{format(selectedScheduleEntry.readingDate, "EEE, MMM dd, yyyy ")}</DialogTitle>
          </DialogHeader>

          <MeterReaderDataTable meterReaders={selectedScheduleEntry!.meterReaders!} />
          <DialogFooter>
            <Button
              onClick={() => {
                const updatedSchedule = schedule.map((entry) => {
                  if (entry.readingDate === selectedScheduleEntry.readingDate) {
                    return { ...entry, meterReaders: selectedScheduleEntry.meterReaders };
                  }
                  return entry;
                });

                setSchedule(updatedSchedule);
                setScheduleEntryDialogIsOpen(false);
              }}
            >
              Apply for the current day
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
};
