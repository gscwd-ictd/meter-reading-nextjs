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
import { CalendarCheck2, CalendarPlus } from "lucide-react";
import { FunctionComponent } from "react";
import { MeterReadingSchedule } from "@mr/lib/types/schedule";
import { Scheduler } from "./useScheduler";
import { toast } from "sonner";
import { useGetCurrentMeterReadersZonebooks } from "./useGetCurrentMeterReadersZonebooks";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

  const setMeterReadersWithDesignatedZonebooks = useSchedulesStore(
    (state) => state.setMeterReadersWithDesignatedZonebooks,
  );

  const { data: meterReaders } = useQuery({
    queryKey: ["get-all-meter-readers"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/meter-readers?status=assigned`);
      return res.data;
    },
  });

  const getMeterReaderZonebooks = useGetCurrentMeterReadersZonebooks();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          disabled={
            (meterReaders && meterReaders.length < 1) || !scheduleHasSplittedDates
              ? true
              : hasPopulatedMeterReaders
                ? true
                : false
          }
          className="dark:text-white"
        >
          {hasPopulatedMeterReaders ? <CalendarCheck2 /> : <CalendarPlus />}
          {!hasPopulatedMeterReaders ? "Populate schedule" : "Populated Schedule"}
        </Button>
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
          <AlertDialogAction
            className="dark:text-white"
            onClick={() => {
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
