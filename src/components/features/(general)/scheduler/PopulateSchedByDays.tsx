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
import { CalendarCheck2, CalendarDaysIcon, CalendarPlus } from "lucide-react";
import { Scheduler } from "./useScheduler";
import { FunctionComponent, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MeterReader } from "@mr/lib/types/personnel";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { useSearchParams } from "next/navigation";
import { toDatesOrDateOnly, toDateString } from "@mr/lib/functions/handleDateArrayOrObject";
import { toast } from "sonner";

type PopulateSchedByDaysAlertDialogProps = {
  schedule: MeterReadingSchedule[];
  scheduler: Scheduler;
};

export const PopulateSchedByDays: FunctionComponent<PopulateSchedByDaysAlertDialogProps> = ({
  schedule,
  scheduler,
}) => {
  const hasPopulatedMeterReaders = useSchedulesStore((state) => state.hasPopulatedMeterReaders);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);
  const setHasFetchedThisMonthsSchedule = useSchedulesStore((state) => state.setHasFetchedSchedule);
  const setHasSchedule = useSchedulesStore((state) => state.setHasSchedule);
  const refetchData = useSchedulesStore((state) => state.refetchData);
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");

  const isDisabled = () => (hasPopulatedMeterReaders ? true : false);

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
          day: schedule.day,
        };
      });

      console.log("BEFORE: ", formattedFilteredSchedule);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_MR_BE}/schedules`, formattedFilteredSchedule);
      console.log("RETURN: ", res.data);
      return res.data;
    },
    onSuccess: async () => {
      toast.success("Success", {
        description:
          "Successfully populated all the meter readers according to their designated zone books for this month!",
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

  const populateMeterReaders = async () => {
    const newSchedule = scheduler.assignMeterReadersWithDays(schedule, meterReaders);

    setCurrentSchedule(
      newSchedule.map((sched) => {
        return { ...sched, meterReaders: sched.meterReaders } as MeterReadingEntryWithZonebooks;
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
              reassignment: {
                zoneBooks: [],
                remarks: null,
              },
            };
          }),
          day: sched.day,
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
        className={`${isDisabled() ? "hidden" : "block"} flex w-full gap-2 px-2 py-1 text-sm hover:brightness-75 dark:text-white`}
      >
        {hasPopulatedMeterReaders ? (
          <CalendarCheck2 className="size-5" />
        ) : (
          <CalendarDaysIcon className="size-5" />
        )}
        {!hasPopulatedMeterReaders ? (
          <span className={`${isDisabled() ? "line-through" : ""}`}>Fully Assigned: With Zone Books</span>
        ) : (
          "-"
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Populate this month&apos;s schedule?</AlertDialogTitle>
          <AlertDialogDescription>
            This will populate meter readers with respective rest days and assigns zone books per day for the
            current month.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="dark:text-white" onClick={populateMeterReaders}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
