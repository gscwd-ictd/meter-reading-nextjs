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
import { TZDate } from "@date-fns/tz";

import { RotateCcwIcon, RotateCwIcon } from "lucide-react";
import { FunctionComponent } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { isAfter, parse, startOfMonth, format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@mr/components/ui/Tooltip";

export const ResetScheduleAlertDialog: FunctionComponent = () => {
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);
  const setNoDueDiscDays = useSchedulesStore((state) => state.setNoDueDiscDays);

  const setScheduleHasSplittedDates = useSchedulesStore((state) => state.setScheduleHasSplittedDates);
  const setCalendarIsSet = useSchedulesStore((state) => state.setCalendarIsSet);
  const setHasSchedule = useSchedulesStore((state) => state.setHasSchedule);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const setLastFetchedMonthYear = useSchedulesStore((state) => state.setLastFetchedMonthYear);
  const noDueDiscDays = useSchedulesStore((state) => state.noDueDiscDays);
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");
  const nowInUTC8 = new TZDate(Date.now(), "Asia/Manila");
  const selectedDate = parse(monthYear!, "yyyy-MM", new Date());
  const selectedFirstDay = startOfMonth(selectedDate);
  const isResetDisabled = isAfter(nowInUTC8, selectedFirstDay);

  // Format the selected month for display in tooltip
  const formattedSelectedMonth = format(selectedDate, "MMMM yyyy");

  const resetStates = () => {
    // set the calendar populate state to false
    setCalendarIsSet(false);

    // set dates to split to empty
    setDatesToSplit([]);

    // reset the populate meter readers observer
    setHasPopulatedMeterReaders(false);

    // reset the splittedDates observer
    setScheduleHasSplittedDates(false);

    // this is set to null, null is the default value
    setScheduleHasSplittedDates(null);

    // reset the observer
    setHasSchedule(false);

    setCurrentSchedule([]);

    setLastFetchedMonthYear(null);

    setNoDueDiscDays(noDueDiscDays);
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
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <AlertDialogTrigger
              className={`flex w-full gap-2 px-2 py-1 text-sm ${
                isResetDisabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
              disabled={isResetDisabled}
            >
              {isResetDisabled ? (
                <RotateCwIcon className="size-5 text-gray-400" />
              ) : (
                <RotateCcwIcon className="size-5 text-green-500" />
              )}
              <span className={isResetDisabled ? "text-gray-400" : ""}>Reset</span>
            </AlertDialogTrigger>
          </TooltipTrigger>
          {isResetDisabled && (
            <TooltipContent side="right" className="max-w-xs">
              <p>
                Cannot reset {formattedSelectedMonth} because the current date (
                {format(nowInUTC8, "MMM d, yyyy")}) is after the first day of the month.
              </p>
              <p className="mt-1 text-xs text-gray-400">You can only reset the current or future months.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
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
