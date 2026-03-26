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
import { MeterReadingEntryWithZonebooks, MeterReadingSchedule } from "@mr/lib/types/schedule";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Calendar } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FunctionComponent } from "react";
import { toast } from "sonner";
import { Scheduler } from "./useScheduler";
import { toDateString } from "@mr/lib/functions/handleDateArrayOrObject";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { isSameMonth, isValid, parse } from "date-fns";

type ManualScheduleAlertDialogProps = {
  schedule: MeterReadingSchedule[];
  scheduler: Scheduler;
};

export const ManualScheduleAlertDialog: FunctionComponent<ManualScheduleAlertDialogProps> = ({
  schedule,
  scheduler,
}) => {
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");

  const filterByMonthYear = (
    schedule: MeterReadingEntryWithZonebooks[],
    monthYear: string,
  ): MeterReadingEntryWithZonebooks[] => {
    const targetDate = parse(monthYear, "yyyy-MM", new Date());

    // Check if target date is valid
    if (!isValid(targetDate)) {
      throw new Error("Invalid monthYear provided");
    }

    return schedule.filter((item) => {
      // readingDate is already a Date object
      const itemDate = item.readingDate;

      // Skip invalid dates
      if (!isValid(itemDate)) return false;

      // Check if it's the same month and year
      return isSameMonth(itemDate, targetDate);
    });
  };

  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);

  const { data: meterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
      return res.data;
    },
  });

  const populateSchedule = async () => {
    const newSchedule = scheduler.assignMeterReaders(schedule, meterReaders);

    // assign an empty array to zoneBooks to initialize
    setCurrentSchedule(
      newSchedule.map((sched) => {
        return {
          ...sched,
          meterReaders: [],
        };
      }),
    );

    setHasPopulatedMeterReaders(true);

    // mutate here
    await postSchedule.mutateAsync(
      filterByMonthYear(
        newSchedule.map((sched) => {
          return {
            readingDate: sched.readingDate,
            day: sched.day,
            dueDate: undefined,
            disconnectionDate: undefined,
            meterReaders: [],
          };
        }),
        monthYear!,
      ),
    );
  };

  const postSchedule = useMutation({
    mutationKey: ["set-schedule", monthYear],
    mutationFn: async (newSchedule: MeterReadingEntryWithZonebooks[]) => {
      //   const filteredSchedule = newSchedule.filter((s) => s.dueDate !== undefined);
      // filter the same month sched
      const formattedFilteredSchedule = newSchedule.map((schedule) => {
        return {
          ...schedule,
          readingDate: toDateString(schedule.readingDate),
          dueDate: null,
          disconnectionDate: null,
          day: schedule.day,
        };
      });

      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/schedules`, formattedFilteredSchedule);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "You have enabled manual schedule for this month",
        position: "top-right",
        duration: 1500,
      });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to save schedule.";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred.", { position: "top-right", duration: 1500 });
      }
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex w-full gap-2 px-2 py-1 text-sm hover:bg-gray-400 hover:text-white dark:text-white">
        <Calendar className="size-5" /> Set a manual schedule
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set a manual schedule for this month?</AlertDialogTitle>
          <AlertDialogDescription>
            This will allow the user to manually set the due and disconnection dates per day.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="dark:text-white" onClick={populateSchedule}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
