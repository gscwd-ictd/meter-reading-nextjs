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
import { useScheduleMeterReaders } from "./useScheduleMeterReaders";

export const PopulateScheduleAlertDialog: FunctionComponent = () => {
  const schedule = useSchedulesStore((state) => state.schedule);
  const setSchedule = useSchedulesStore((state) => state.setSchedule);
  const meterReaders = useMeterReadersStore((state) => state.meterReaders);
  const { assignReadersToSchedules } = useScheduleMeterReaders(schedule, meterReaders);

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
              setSchedule(assignReadersToSchedules());
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
