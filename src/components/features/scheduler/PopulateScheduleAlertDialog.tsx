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
import { CalendarCheck2, CalendarPlus } from "lucide-react";
import { FunctionComponent, useEffect } from "react";
import { MeterReadingEntryWithZonebooks, MeterReadingSchedule } from "@mr/lib/types/schedule";
import { Scheduler } from "./useScheduler";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { toDatesOrDateOnly, toDateString } from "@mr/lib/functions/handleDateArrayOrObject";

type PopulateScheduleAlertDialogProps = {
  schedule: MeterReadingSchedule[];
  scheduler: Scheduler;
};

export const PopulateScheduleAlertDialog: FunctionComponent<PopulateScheduleAlertDialogProps> = ({
  schedule,
  scheduler,
}) => {
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const scheduleHasSplittedDates = useSchedulesStore((state) => state.scheduleHasSplittedDates);
  const hasPopulatedMeterReaders = useSchedulesStore((state) => state.hasPopulatedMeterReaders);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);
  const setHasFetchedThisMonthsSchedule = useSchedulesStore((state) => state.setHasFetchedSchedule);
  const setHasSchedule = useSchedulesStore((state) => state.setHasSchedule);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");

  const isDisabled = () =>
    (meterReaders && meterReaders.length < 1) || !scheduleHasSplittedDates
      ? true
      : hasPopulatedMeterReaders
        ? true
        : false;

  const { data: meterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
      return res.data;
    },
  });

  const postSchedule = useMutation({
    mutationKey: ["set-schedule", monthYear],
    mutationFn: async (newSchedule: MeterReadingEntryWithZonebooks[]) => {
      const filteredSchedule = newSchedule.filter((s) => s.dueDate !== undefined);
      const formattedFilteredSchedule = filteredSchedule.map((schedule) => {
        return {
          ...schedule,
          dueDate: toDatesOrDateOnly(schedule.dueDate),
          readingDate: toDateString(schedule.readingDate),
          disconnectionDate: toDatesOrDateOnly(schedule.disconnectionDate),
        };
      });

      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/schedules`, formattedFilteredSchedule);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description: "Successfully populated all the meter readers for this month!",
        position: "top-right",
        duration: 1500,
      });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Failed to save schedule.";
        toast.error(message, { position: "top-right", duration: 1500 });
      } else {
        toast.error("An unexpected error occurred.", { position: "top-right", duration: 1500 });
      }
    },
  });

  const populateSchedule = async () => {
    const newSchedule = scheduler.assignMeterReaders(schedule, meterReaders);

    // assign an empty array to zoneBooks to initialize
    setCurrentSchedule(
      newSchedule.map((sched) => {
        return {
          ...sched,
          meterReaders: sched.meterReaders?.map((mr) => {
            return { ...mr, zoneBooks: [] };
          }),
        };
      }),
    );

    setHasPopulatedMeterReaders(true);

    // mutate here
    await postSchedule.mutateAsync(
      newSchedule.map((sched) => {
        return {
          readingDate: sched.readingDate,
          dueDate: sched.dueDate,
          disconnectionDate: sched.disconnectionDate,
          meterReaders: sched.meterReaders?.map((mr) => {
            return {
              ...mr,
              zoneBooks: [],
            };
          }),
        };
      }),
    );
  };

  useEffect(() => {
    if (postSchedule.isSuccess) {
      refetchData!();
      postSchedule.reset();

      setHasSchedule(true);
      setHasFetchedThisMonthsSchedule(true);
    }
  }, [postSchedule, refetchData, setHasSchedule, setHasFetchedThisMonthsSchedule]);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={isDisabled()}
        className="flex w-full gap-2 px-2 py-1 text-sm dark:text-white"
      >
        {hasPopulatedMeterReaders ? (
          <CalendarCheck2 className="size-5" />
        ) : (
          <CalendarPlus className="size-5" />
        )}
        {!hasPopulatedMeterReaders ? (
          <span className={`${isDisabled() ? "line-through" : ""}`}>Populate schedule</span>
        ) : (
          "Fetched Schedule"
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Populate this month&apos;s schedule with meter readers?</AlertDialogTitle>
          <AlertDialogDescription>
            This will populate all meter readers with their respective rest days and default zoneBooks for
            this month.
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
