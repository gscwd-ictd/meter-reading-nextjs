"use client";

import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useScheduler } from "./useScheduler";
import { Holidays, holidays } from "./holidays";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { Button } from "@mr/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ButtonGroup } from "@mr/components/ui/ButtonGroup";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { CalendarSettingDropdown } from "./CalendarSettingDropdown";
import { ScheduleEntryContextMenu } from "./ScheduleEntryContextMenu";
import { useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import mergeScheduleIntoCalendar from "@mr/lib/functions/merge-schedule-into-calendar";
import { motion } from "framer-motion";
import { Skeleton } from "@mr/components/ui/Skeleton";
import { MonthYearPicker } from "../calendar/MonthYearPicker";
import { ScheduleEntryDialog } from "./ScheduleEntryDialog";
import { AddCustomMeterReaderDialog } from "../meter-readers/AddCustomMeterReaderDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@mr/components/ui/Tooltip";
import { AddCustomScheduleEntryDialog } from "./entry/AddCustomScheduleEntryDialog";
import { transformHolidays } from "@mr/lib/functions/transformHolidays";

type SchedulerProps = {
  holidaysLoaded: boolean;
  holidays: Holidays;
};

export const Scheduler: FunctionComponent<SchedulerProps> = ({ holidays, holidaysLoaded }) => {
  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);
  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const searchParams = useSearchParams();
  const monthYear = searchParams.get("date");
  const calendarIsSet = useSchedulesStore((state) => state.calendarIsSet);
  const lastFetchedMonthYear = useSchedulesStore((state) => state.lastFetchedMonthYear);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setCalendarIsSet = useSchedulesStore((state) => state.setCalendarIsSet);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const setScheduleHasSplittedDates = useSchedulesStore((state) => state.setScheduleHasSplittedDates);
  const setHasPopulatedMeterReaders = useSchedulesStore((state) => state.setHasPopulatedMeterReaders);
  const setHasFetchedThisMonthsSchedule = useSchedulesStore((state) => state.setHasFetchedSchedule);
  const setHasSchedule = useSchedulesStore((state) => state.setHasSchedule);
  const setRefetchData = useSchedulesStore((state) => state.setRefetchData);
  const setLastFetchedMonthYear = useSchedulesStore((state) => state.setLastFetchedMonthYear);
  const [currentMonthYear, setCurrentMonthYear] = useState<string | null>(monthYear);
  const [activeContext, setActiveContext] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const scheduler = useScheduler(holidays ?? []);

  const hasValidSchedule = (monthYear: string) => {
    return currentSchedule.some(
      (entry) => entry.readingDate && format(entry.readingDate, "yyyy-MM") === monthYear,
    );
  };

  // this adds timeout when switching months
  const handleMonthChange = (direction: "prev" | "next" | "today") => {
    if (!holidaysLoaded || isNavigating) return; // prevent rapid repeat

    setIsNavigating(true);

    resetOnChange();

    if (direction === "prev") {
      scheduler.goToPreviousMonth();
    } else if (direction === "next") {
      scheduler.goToNextMonth();
    } else {
      scheduler.today();
    }

    // Release lock after short timeout
    setTimeout(() => setIsNavigating(false), 1200); // or adjust timing
  };

  // these are derived states
  // const hasFetched = lastFetchedMonthYear === currentMonthYear;
  const hasFetched = lastFetchedMonthYear === currentMonthYear && hasValidSchedule(currentMonthYear!);

  // scheduler.addSundayReadings(currentSchedule);

  const {
    data: schedule,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["get-schedule", currentMonthYear],
    enabled: calendarIsSet && !hasFetched && currentSchedule.length > 0 && currentMonthYear !== null,
    queryFn: async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${currentMonthYear}`);
        return res.data as MeterReadingEntryWithZonebooks[];
      } catch (error) {
        console.log(error);
        toast.error("Error", {
          description: "Cannot find schedule.",
          position: "top-right",
        });
      }
    },
    retry: false,
    retryOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  // these are derived loading states, it should be below the useQuery since loading is derived
  const isInitializingCalendar = (!calendarIsSet && currentSchedule.length === 0) || !holidaysLoaded;
  const isFetchingSchedule = calendarIsSet && currentSchedule.length > 0 && isLoading;
  const isReady = calendarIsSet && currentSchedule.length > 0 && !isLoading && holidaysLoaded;

  // this ensures that monthYear does not go null
  useEffect(() => {
    if (monthYear) setCurrentMonthYear(monthYear);
  }, [monthYear]);

  // this should populate the calendar first #1
  useEffect(() => {
    if (!calendarIsSet && currentMonthYear) {
      const initialDates = scheduler.splitDates(datesToSplit);
      setCurrentSchedule(
        initialDates.map((sched) => {
          return { ...sched, meterReaders: [] };
        }),
      );
      setCalendarIsSet(true);
    }
  }, [calendarIsSet, currentMonthYear, scheduler, datesToSplit, setCalendarIsSet, setCurrentSchedule]);

  // run this state setter if the there is a fetched schedule for the month
  const hasScheduleOption = useCallback(() => {
    // this should be true since this function is executed
    setHasSchedule(true);

    // this would turn true since you cannot submit without submitting
    setScheduleHasSplittedDates(true);

    // this should turn true since populating of meter readers is only allowed when the schedule is empty for the month
    setHasPopulatedMeterReaders(true);
  }, [setHasSchedule, setScheduleHasSplittedDates, setHasPopulatedMeterReaders]);

  // run this state setter if there is no fetched schedule for the month
  const hasNoScheduleOption = useCallback(() => {
    // this should be false since this function is executed
    setHasSchedule(false);

    // this would turn false since schedule has not yet been submitted
    setScheduleHasSplittedDates(false);

    // this should turn false since schedule has not yet been submitted
    setHasPopulatedMeterReaders(false);
  }, [setHasSchedule, setScheduleHasSplittedDates, setHasPopulatedMeterReaders]);

  // this is the reset state button when from one month to another
  const resetOnChange = () => {
    // set the calendar populate state to false
    setCalendarIsSet(false);

    // set dates to split to empty
    setDatesToSplit([]);

    // reset the populate meter readers observer
    setHasPopulatedMeterReaders(false);

    // reset the splittedDates observer
    setScheduleHasSplittedDates(false);

    // reset the observer
    setHasSchedule(false);

    setCurrentSchedule([]);

    setLastFetchedMonthYear(null);
  };

  // update the state of currentSchedule based on the fetched schedule
  useEffect(() => {
    if (!calendarIsSet || hasFetched || !currentMonthYear || isFetching || isLoading) return;

    if (calendarIsSet && schedule && schedule.length > 0 && !isFetching && !isLoading && currentMonthYear) {
      setCurrentSchedule(mergeScheduleIntoCalendar(currentSchedule, schedule));
      hasScheduleOption();
      setRefetchData(() => refetch);
      setLastFetchedMonthYear(currentMonthYear);
    } else if (
      calendarIsSet &&
      !isLoading &&
      schedule &&
      schedule.length === 0 &&
      !isFetching &&
      currentMonthYear
    ) {
      hasNoScheduleOption();
      setLastFetchedMonthYear(currentMonthYear);
      setRefetchData(refetch);
    }
  }, [
    schedule,
    isLoading,
    isFetching,
    currentMonthYear,
    scheduler,
    hasFetched,
    calendarIsSet,
    currentSchedule,
    refetch,
    setRefetchData,
    setCurrentSchedule,
    hasNoScheduleOption,
    setLastFetchedMonthYear,
    hasScheduleOption,
  ]);

  // this sets the global state of the current month's fetch
  useEffect(() => {
    setHasFetchedThisMonthsSchedule(hasFetched);
  }, [setHasFetchedThisMonthsSchedule, hasFetched]);

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
      <div className="flex h-full flex-col overflow-hidden bg-transparent">
        <header className="flex items-center justify-between px-2">
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
              <h1 className="text-lg font-bold">{format(scheduler.currentDate, "yyyy MMMM")}</h1>

              <section className="text-muted-foreground flex items-center gap-1 text-sm">
                <p>{format(startOfMonth(scheduler.currentDate), "MMM dd, yyyy")}</p>
                <p>{`-`}</p>
                <p>{format(endOfMonth(scheduler.currentDate), "MMM dd, yyyy")}</p>
              </section>
            </div>
          </section>

          <section className="hidden sm:hidden md:block lg:block">
            <ButtonGroup className="rounded-md border">
              <Button
                variant="outline"
                className="border-none dark:rounded-none"
                onClick={() => {
                  handleMonthChange("prev");
                }}
              >
                <ChevronLeft />
              </Button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="border-none dark:rounded-none"
                    variant="outline"
                    onClick={() => {
                      handleMonthChange("today");
                    }}
                  >
                    Month
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="dark:text-white">Jump to current month</p>
                </TooltipContent>
              </Tooltip>
              <Button
                variant="outline"
                className="border-none dark:rounded-none"
                onClick={() => {
                  handleMonthChange("next");
                }}
              >
                <ChevronRight />
              </Button>
            </ButtonGroup>
          </section>

          <section className="flex items-center gap-4">
            <MonthYearPicker
              currentMonthYear={currentMonthYear}
              setCurrentMonthYear={setCurrentMonthYear}
              resetOnChange={resetOnChange}
              scheduler={scheduler}
            />

            <CalendarSettingDropdown scheduler={scheduler} />
          </section>
        </header>
        <main className="flex h-full flex-1 flex-col overflow-hidden p-2">
          {/* Calendar Header Section */}
          <section className="grid grid-cols-7 bg-transparent text-xs font-semibold tracking-wide text-black uppercase dark:text-white">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
              <div key={index} className="border-none py-2 text-center">
                {day}
              </div>
            ))}
          </section>
          {isInitializingCalendar ? (
            <div className="text-primary flex h-full w-full items-center justify-center gap-2 text-xl">
              <LoadingSpinner className="size-12" /> Loading Calendar...
              {/* <LoadingBadge /> */}
            </div>
          ) : (
            <>
              {/* Calendar Body Section */}
              <section className="relative flex-1 overflow-hidden border-t" style={gridStyle}>
                {/* Overlay loading indicator while fetching schedules */}
                {isFetchingSchedule && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/20 dark:bg-transparent">
                    <div className="text-primary flex items-center gap-2 text-xl">
                      <LoadingSpinner className="size-12 animate-spin" /> Getting Schedules...
                    </div>
                  </div>
                )}

                {/* Skeleton grid cells during fetch */}
                {isFetchingSchedule && !isReady && (
                  <div className="absolute inset-0 z-10 grid grid-cols-7 gap-px p-1">
                    {Array.from({ length: scheduler.calculateSchedule().length }).map((_, idx) => (
                      <div
                        key={idx}
                        className="border-border bg-background grid grid-cols-1 grid-rows-5 gap-1 border border-dashed p-0"
                      >
                        <div className="flex justify-end">
                          <Skeleton className="size-6 rounded-full p-2" />
                        </div>
                        <div className="flex w-full justify-center">
                          <div className="flex w-1/3 justify-center">
                            <Skeleton className="size-6 rounded-full" />
                            <Skeleton className="-ml-2 size-6 rounded-full" />
                            <Skeleton className="-ml-2 size-6 rounded-full" />
                          </div>
                        </div>
                        <Skeleton className="w-full" />
                        <Skeleton className="w-full" />
                        <div></div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render actual calendar only when ready */}
                {!isFetchingSchedule &&
                  isReady &&
                  currentSchedule.map((entry, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className={`group relative flex flex-col border-b border-l ${idx + 1 !== 1 && (idx + 1) % 7 === 0 ? "border-r" : "border-r-0"} p-0 transition-colors duration-150 ease-in-out`}
                    >
                      <ScheduleEntryContextMenu
                        activeContext={activeContext}
                        currentDate={scheduler.currentDate}
                        entry={entry}
                        setActiveContext={setActiveContext}
                        idx={idx}
                        scheduler={scheduler}
                      />
                    </motion.div>
                  ))}
              </section>
            </>
          )}
        </main>
      </div>
      <ScheduleEntryDialog />
      <AddCustomMeterReaderDialog />
      <AddCustomScheduleEntryDialog />
    </>
  );
};
