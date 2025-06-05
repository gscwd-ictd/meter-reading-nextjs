/* eslint-disable @typescript-eslint/no-unused-vars */

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@mr/components/ui/AlertDialog";

import { RotateCcwIcon } from "lucide-react";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Scheduler } from "./useScheduler";
import { toast } from "sonner";

type PopulateScheduleAlertDialogProps = {
  scheduler: Scheduler;
};

export const ResetScheduleAlertDialog: FunctionComponent<PopulateScheduleAlertDialogProps> = ({
  scheduler,
}) => {
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const setCalendarScheduleDropdownIsOpen = useSchedulesStore(
    (state) => state.setCalendarScheduleDropdownIsOpen,
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex w-full gap-2 px-2 py-1 text-sm">
        <RotateCcwIcon className="size-5 text-green-500" /> <span>Reset</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset Schedule</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all changes made for this month&apos;s schedule
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              setCurrentSchedule(scheduler.calculateSchedule());
              setDatesToSplit([]);
              toast.success("Success", {
                description: "Successfully reset the calendar for this month!",
                position: "top-right",
                duration: 1500,
              });

              setCalendarScheduleDropdownIsOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
