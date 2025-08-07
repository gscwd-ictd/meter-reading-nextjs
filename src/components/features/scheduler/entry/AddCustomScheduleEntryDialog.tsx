"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mr/components/ui/Dialog";
import { format } from "date-fns";
import CalendarPicker from "../../calendar/CalendarPicker";
import { useState } from "react";
import { Button } from "@mr/components/ui/Button";
import { holidays, NonBusinessDays } from "../holidays";
import { Input } from "@mr/components/ui/Input";

export const AddCustomScheduleEntryDialog = () => {
  const open = useSchedulesStore((state) => state.addCustomScheduleEntryDialogIsOpen);
  const setOpen = useSchedulesStore((state) => state.setAddCustomScheduleEntryDialogIsOpen);
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);

  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [disconnectionDate, setDisconnectionDate] = useState<Date | undefined>(undefined);

  //   const readingDate = selectedScheduleEntry?.readingDate
  //     ? new Date(selectedScheduleEntry.readingDate)
  //     : undefined;

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent className="max-w-md rounded-xl p-6">
        {/* Header */}
        <DialogHeader>
          <DialogTitle className="text-primary text-xl font-semibold">Add Schedule Entry</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Select a due date and we’ll automatically calculate the disconnection date.
          </DialogDescription>
        </DialogHeader>

        {/* Reading Date Section */}
        <div className="mt-4">
          <p className="text-primary mb-1 text-sm font-medium">Reading Date</p>
          {/* <div className="px-3 text-sm font-normal">
            {selectedScheduleEntry ? format(selectedScheduleEntry?.readingDate, "MMMM dd, yyyy") : "-"}
          </div> */}
          <Input
            defaultValue={
              selectedScheduleEntry ? format(selectedScheduleEntry?.readingDate, "MMMM dd, yyyy") : "-"
            }
            className="disabled:text-gray-900"
            readOnly
          />
        </div>

        {/* Calendar Picker Section */}
        <>
          <CalendarPicker
            startDate={selectedScheduleEntry?.readingDate!}
            dueDate={dueDate}
            setDueDate={setDueDate}
            disconnectionDate={disconnectionDate}
            setDisconnectionDate={setDisconnectionDate}
            nonBusinessDays={NonBusinessDays}
            holidays={holidays}
          />

          {/* Hints for user */}
          <div className="mt-2 text-xs text-gray-500">
            <p>• Due date defaults to 15 days after the reading date (skips holidays & weekends).</p>
            <p>• Disconnection date is 3 days after the due date (skips holidays & weekends).</p>
          </div>
        </>

        {/* Footer */}
        <DialogFooter className="pt-6">
          <Button className="w-full">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
