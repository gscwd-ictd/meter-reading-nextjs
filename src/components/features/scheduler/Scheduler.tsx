"use client";

import { FunctionComponent, useEffect, useState } from "react";
import { useScheduler } from "./useScheduler";
import { Holidays } from "./holidays";
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

type SchedulerProps = {
  holidays: Holidays;
};

export const Scheduler: FunctionComponent<SchedulerProps> = ({ holidays }) => {
  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);

  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");

  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);

  //!!!!! remove
  const calendarIsSet = useSchedulesStore((state) => state.calendarIsSet);
  //!!!!! remove
  const setCalendarIsSet = useSchedulesStore((state) => state.setCalendarIsSet);
  const [activeContext, setActiveContext] = useState<number | null>(null);

  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);

  const scheduler = useScheduler(holidays, [], monthYear ?? format(new Date(), "MM-yyyy"));

  scheduler.addSundayReadings(currentSchedule);

  useEffect(() => {
    //! Add a logic here to check the current monthyear and check from db if it has a schedule already
    if (!calendarIsSet && !hasSchedule) {
      setCurrentSchedule(scheduler.splitDates(datesToSplit));

      setCalendarIsSet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduler.currentDate, setCurrentSchedule, setCalendarIsSet, calendarIsSet, hasSchedule]);

  useEffect(() => {}, [scheduler.currentDate]);

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
            <div className="text-primary flex h-full w-full items-center justify-center gap-1 text-2xl">
              <LoadingSpinner className="size-14" /> Loading Calendar...
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
