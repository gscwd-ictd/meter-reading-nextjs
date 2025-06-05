/* eslint-disable @typescript-eslint/no-unused-vars */
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

type PopulateScheduleAlertDialogProps = {
  schedule: MeterReadingSchedule[];
  scheduler: Scheduler;
};

export const PopulateScheduleAlertDialog: FunctionComponent<PopulateScheduleAlertDialogProps> = ({
  schedule,
  scheduler,
}) => {
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const meterReaders = useMeterReadersStore((state) => state.meterReaders);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button disabled={meterReaders.length < 1 ? true : false}>
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
            onClick={() => {
              setCurrentSchedule(scheduler.assignMeterReaders(schedule, meterReaders));
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
