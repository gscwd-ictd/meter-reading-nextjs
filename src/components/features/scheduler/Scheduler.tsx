"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { useScheduler } from "./useScheduler";
import { holidays } from "./holidays";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Button } from "@mr/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonGroup } from "@mr/components/ui/ButtonGroup";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { CalendarSettingDropdown } from "./CalendarSettingDropdown";
import { PopulateScheduleAlertDialog } from "./PopulateScheduleAlertDialog";
import { ScheduleEntryContextMenu } from "./ScheduleEntryContextMenu";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { MeterReadingSchedule } from "@mr/lib/types/schedule";
import mergeScheduleIntoCalendar from "@mr/lib/functions/merge-schedule-into-calendar";

export const Scheduler: FunctionComponent = () => {
  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");
  const calendarIsSet = useSchedulesStore((state) => state.calendarIsSet);
  const setCalendarIsSet = useSchedulesStore((state) => state.setCalendarIsSet);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);
  const setScheduleHasSplittedDates = useSchedulesStore((state) => state.setScheduleHasSplittedDates);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);
  const hasFetchedSchedule = useSchedulesStore((state) => state.hasFetchedSchedule);
  const setHasFetchedSchedule = useSchedulesStore((state) => state.setHasFetchedSchedule);

  const scheduler = useScheduler(holidays, [], monthYear ?? format(new Date(), "MM-yyyy"));
  const [activeContext, setActiveContext] = useState<number | null>(null);

  scheduler.addSundayReadings(currentSchedule);

  const {
    data: schedule,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["get-schedule", monthYear],
    enabled: calendarIsSet && !hasFetchedSchedule && monthYear !== null,
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${monthYear}`);
        return res.data as MeterReadingSchedule[];
      } catch (error) {
        console.log(error);
        toast.error("Cannot find schedule");
      }
    },
  });

  // this should populate the calendar first
  useEffect(() => {
    if (!calendarIsSet) {
      setCurrentSchedule(scheduler.splitDates(datesToSplit));
      setCalendarIsSet(true);
    }
  }, [scheduler, setCurrentSchedule, setCalendarIsSet, calendarIsSet, datesToSplit]);

  // this should populate the schedule if ever there is
  useEffect(() => {
    if (schedule && !isError && schedule.length > 0 && !hasFetchedSchedule) {
      // append the schedule to the calendar
      setCurrentSchedule(mergeScheduleIntoCalendar(currentSchedule, schedule));
      setHasFetchedSchedule(true);
    } else if (((schedule && schedule.length === 0) || isError) && !hasFetchedSchedule) {
      setHasFetchedSchedule(true);
    }
  }, [
    schedule,
    isError,
    isLoading,
    currentSchedule,
    setCurrentSchedule,
    setHasFetchedSchedule,
    calendarIsSet,
    hasFetchedSchedule,
  ]);

  // Calculate number of rows needed for the calendar
  const numberOfWeeks = Math.ceil(scheduler.calculateSchedule().length / 7);

  // Create grid styles using inline style for dynamic row count
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))`,
  };

  return (
    <>
      <div className="m-5 flex h-full flex-col rounded border">
        <header className="flex items-center justify-between p-4">
          <section className="flex items-center gap-4">
            <div className="flex size-14 flex-col overflow-clip rounded-lg border">
              <div className="bg-secondary text-secondary-foreground/70 flex flex-1 items-center justify-center border-b text-xs font-semibold tracking-wider uppercase">
                {format(new Date(), "MMM")}
              </div>

              <div className="flex flex-1 items-center justify-center text-lg font-bold">
                {format(new Date(), "dd")}
              </div>
            </div>

            <div>
              <h1 className="text-lg font-bold">{format(scheduler.currentDate, "MMMM yyyy")}</h1>

              <section className="text-muted-foreground flex items-center gap-1 text-sm">
                <p>{format(startOfMonth(scheduler.currentDate), "MMM dd, yyyy")}</p>
                <p>{`-`}</p>
                <p>{format(endOfMonth(scheduler.currentDate), "MMM dd, yyyy")}</p>
              </section>
            </div>
          </section>

          <ButtonGroup>
            <Button
              variant="outline"
              onClick={() => {
                scheduler.goToPreviousMonth();
                setDatesToSplit([]);
                setCalendarIsSet(false);
                setScheduleHasSplittedDates(false);
                setHasPopulatedMeterReaders(false);
              }}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                scheduler.today();
                setDatesToSplit([]);
                setCalendarIsSet(false);
                setScheduleHasSplittedDates(false);
                setHasPopulatedMeterReaders(false);
              }}
            >
              Today
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                scheduler.goToNextMonth();
                setDatesToSplit([]);
                setCalendarIsSet(false);
              }}
            >
              <ChevronRight />
            </Button>
          </ButtonGroup>

          <section className="flex items-center gap-0">
            <section className="flex items-center gap-4">
              <div className="space-x-2">
                <PopulateScheduleAlertDialog schedule={currentSchedule} scheduler={scheduler} />
                <CalendarSettingDropdown scheduler={scheduler} />
              </div>
            </section>
          </section>
        </header>

        <main className="flex h-full flex-1 flex-col overflow-hidden">
          {currentSchedule.length === 0 ? (
            <div className="text-primary flex h-full w-full items-center justify-center gap-1 text-xl">
              <LoadingSpinner className="size-12" /> Loading Calendar...
            </div>
          ) : (
            currentSchedule &&
            currentSchedule.length > 0 && (
              <section className="grid grid-cols-7 border-y">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <div
                    key={index}
                    className="border-l py-2 text-center text-xs font-semibold uppercase first:border-l-0"
                  >
                    {day}
                  </div>
                ))}
              </section>
            )
          )}

          <section className="flex-1" style={gridStyle}>
            {currentSchedule &&
              currentSchedule.map((entry, idx) => {
                return (
                  <ScheduleEntryContextMenu
                    activeContext={activeContext}
                    currentDate={scheduler.currentDate}
                    entry={entry}
                    setActiveContext={setActiveContext}
                    idx={idx}
                    key={idx}
                    scheduler={scheduler}
                  />
                );
              })}
          </section>
        </main>
      </div>
    </>
  );
};
