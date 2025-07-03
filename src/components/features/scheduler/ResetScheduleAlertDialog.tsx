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
import axios from "axios";
import { useSearchParams } from "next/navigation";

export const ResetScheduleAlertDialog: FunctionComponent = () => {
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);

  const setScheduleHasSplittedDates = useSchedulesStore((state) => state.setScheduleHasSplittedDates);
  const setCalendarIsSet = useSchedulesStore((state) => state.setCalendarIsSet);
  const setHasSchedule = useSchedulesStore((state) => state.setHasSchedule);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const setLastFetchedMonthYear = useSchedulesStore((state) => state.setLastFetchedMonthYear);
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");

  const resetStates = () => {
    // set the calendar populate state to false
    setCalendarIsSet(false);

    // set dates to split to empty
    setDatesToSplit([]);

    // reset the populate meter readers observer
    setHasPopulatedMeterReaders(false);

    // reset the splittedDates observer
    setScheduleHasSplittedDates(false);

    // reset the observer
    setHasSchedule(false);

    setCurrentSchedule([]);

    setLastFetchedMonthYear(null);
  };

  const removeMonthlySchedule = async () => {
    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${monthYear}`);
      // setCurrentSchedule(scheduler.calculateSchedule().);
      resetStates();

      refetchData!();
      toast.success("Success", {
        description: "Successfully reset the calendar for this month!",
        position: "top-right",
        duration: 1500,
      });

      // setCalendarScheduleDropdownIsOpen(false);
      return res.data;
    } catch (error) {
      toast.error("Error", {
        description: "There seems to be a problem. Please try again in a few seconds",
        position: "top-right",
      });
    }
  };

  const reset = () => {
    // set the calendar populate state to false
    setCalendarIsSet(false);

    // set dates to split to empty
    setDatesToSplit([]);

    // reset the splittedDates observer
    setScheduleHasSplittedDates(false);

    setLastFetchedMonthYear(null);
  };

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
            onClick={hasSchedule ? removeMonthlySchedule : reset}
            className="dark:text-white"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
