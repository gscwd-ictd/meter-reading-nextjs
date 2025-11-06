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
import { CalendarDaysIcon } from "lucide-react";
import { Scheduler } from "./useScheduler";
import { FunctionComponent } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MeterReader } from "@mr/lib/types/personnel";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";

type PopulateSchedByDaysAlertDialogProps = {
  schedule: MeterReadingSchedule[];
  scheduler: Scheduler;
};

export const PopulateSchedByDays: FunctionComponent<PopulateSchedByDaysAlertDialogProps> = ({
  schedule,
  scheduler,
}) => {
  const { data: meterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
      return res.data;
    },
  });

  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);

  const populateMeterReaders = async () => {
    // const newSchedule = scheduler.assignMeterReaders(schedule, meterReaders);
    // const meterReadersWithDays = addRandomDayNumbers(meterReaders);

    // const newSchedule = scheduler.assignMeterReaders(schedule, meterReadersWithDays);
    const newSchedule = scheduler.assignMeterReadersWithDays(schedule, meterReaders);
    console.log(newSchedule);

    setCurrentSchedule(
      newSchedule.map((sched) => {
        return { ...sched, meterReaders: sched.meterReaders } as MeterReadingEntryWithZonebooks;
      }),
    );

    setHasPopulatedMeterReaders(true);

    console.log("SCHEDULE: ", scheduler.logDayAssignments(schedule));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex w-full gap-2 px-2 py-1 text-sm dark:text-white">
        <CalendarDaysIcon className="size-5" />
        <span>Populate by Days</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Populate this month&apos;s schedule?</AlertDialogTitle>
          <AlertDialogDescription>
            This will populate all meter readers with their respective rest days, and assigned zone books for
            this month.
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
