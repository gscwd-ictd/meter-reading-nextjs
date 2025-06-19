import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
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
import { Button } from "@mr/components/ui/Button";
import { CalendarPlus } from "lucide-react";
import { FunctionComponent } from "react";
import { MeterReadingSchedule } from "@mr/lib/types/schedule";
import { Scheduler } from "./useScheduler";
import { toast } from "sonner";
import { useGetCurrentMeterReadersZonebooks } from "./useGetCurrentMeterReadersZonebooks";

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
  const meterReaders = useMeterReadersStore((state) => state.meterReaders);
  const setMeterReadersWithDesignatedZonebooks = useSchedulesStore(
    (state) => state.setMeterReadersWithDesignatedZonebooks,
  );

  const getMeterReaderZonebooks = useGetCurrentMeterReadersZonebooks();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={meterReaders.length < 1 || !scheduleHasSplittedDates ? true : false}
          className="dark:text-white"
        >
          <CalendarPlus />
          Populate schedule
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Populate this month&apos;s schedule with meter readers?</AlertDialogTitle>
          <AlertDialogDescription>
            This will populate all meter readers with their respective rest days and default zonebooks for
            this month.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="dark:text-white"
            onClick={() => {
              const newSchedule = scheduler.assignMeterReaders(schedule, meterReaders);

              // assign an empty array to zonebooks to initialize
              setCurrentSchedule(
                newSchedule.map((sched) => {
                  return {
                    ...sched,
                    meterReaders: sched.meterReaders?.map((mr) => {
                      return { ...mr, zonebooks: [] };
                    }),
                  };
                }),
              );

              // this will be the default pool and will always be compared to after applying changes per entry(per day)
              setMeterReadersWithDesignatedZonebooks(getMeterReaderZonebooks.defaultZonebooks(newSchedule));

              toast.success("Success", {
                description: "Successfully populated all the meter readers for this month!",
                position: "top-right",
                duration: 1500,
              });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
