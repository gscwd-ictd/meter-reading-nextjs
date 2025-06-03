/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useScheduler } from "./useScheduler";
import { holidays } from "./holidays";
import {
  compareAsc,
  endOfMonth,
  format,
  formatDate,
  getDate,
  isSameMonth,
  isSaturday,
  isSunday,
  startOfMonth,
} from "date-fns";
import { Button } from "@mr/components/ui/Button";
import {
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LogsIcon,
  SquarePenIcon,
  SquareSplitHorizontalIcon,
} from "lucide-react";
import { ButtonGroup } from "@mr/components/ui/ButtonGroup";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { Badge } from "@mr/components/ui/Badge";
import { toast } from "sonner";
import { useMeterReadersStore } from "@mr/components/stores/useMeterReadersStore";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { useScheduleMeterReaders } from "./useScheduleMeterReaders";
import { CalendarSettingDropdown } from "./CalendarSettingDropdown";
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@mr/components/ui/ContextMenu";
import { ContextMenuContent } from "@radix-ui/react-context-menu";
import { PopulateScheduleAlertDialog } from "./PopulateScheduleAlertDialog";

export default function Scheduler() {
  const [datesToSplit, setDatesToSplit] = useState<Date[]>([]);

  const schedule = useSchedulesStore((state) => state.schedule);
  const setSchedule = useSchedulesStore((state) => state.setSchedule);

  //!!!!! remove
  const calendarIsSet = useSchedulesStore((state) => state.calendarIsSet);

  //!!!!! remove
  const setCalendarIsSet = useSchedulesStore((state) => state.setCalendarIsSet);

  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);

  //! remove
  const setScheduleEntryDialogIsOpen = useSchedulesStore((state) => state.setScheduleEntryDialogIsOpen);

  const [activeContext, setActiveContext] = useState<number | null>(null);

  const meterReaders = useMeterReadersStore((state) => state.meterReaders);

  //! remove
  const scheduleMeterReaders = useScheduleMeterReaders(schedule, meterReaders);

  // console.log(schedule);

  const scheduler = useScheduler(holidays, []);

  // add sunday readings
  scheduler.addSundayReadings(schedule!);

  // scheduleMeterReaders.assignReadersToSchedules();

  // console.log(sundayReadings);

  useEffect(() => {
    if (!calendarIsSet) {
      setSchedule(scheduler.calculateSchedule());
      setCalendarIsSet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduler.currentDate, calendarIsSet]);

  // Calculate number of rows needed for the calendar
  const numberOfWeeks = Math.ceil(scheduler.calculateSchedule().length / 7);

  // Create grid styles using inline style for dynamic row count
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
    gridTemplateRows: `repeat(${numberOfWeeks}, minmax(0, 1fr))`,
  };

  // useEffect(() => {
  //   const newDates = scheduler.splitDates(datesToSplit);
  //   // setSchedule(newDates);
  //   console.log(newDates);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [datesToSplit, schedule]);

  return (
    <>
      <div className="flex h-full flex-col">
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
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log(schedule);
                  }}
                >
                  <LogsIcon />
                  Log Current Schedule
                </Button>
                {/* <Button
                variant="default"
                onClick={() => {
                  // console.log(scheduleMeterReaders.allReadingDates());
                  console.log(schedule);
                }}
              >
                <LockIcon />
                Lock Calendar
              </Button> */}
                <PopulateScheduleAlertDialog />
                <CalendarSettingDropdown scheduler={scheduler} />
              </div>
            </section>
          </section>
        </header>

        <main className="flex h-full flex-1 flex-col overflow-hidden">
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

          <section className="flex-1" style={gridStyle}>
            {schedule &&
              schedule.map((entry, idx) => {
                const isWithinMonth = isSameMonth(entry.readingDate, startOfMonth(scheduler.currentDate));
                const dateIsSunday = isSunday(entry.readingDate);
                const dateIsSaturday = isSaturday(entry.readingDate);
                const hasSchedule = entry.meterReaders?.find(
                  (mr) => Array.isArray(mr.zonebooks) && mr.zonebooks.length > 0,
                );

                return (
                  <ContextMenu
                    key={idx}
                    onOpenChange={(open) => {
                      if (!open && idx === activeContext) {
                        setActiveContext(null);
                      }
                    }}
                  >
                    <ContextMenuTrigger asChild>
                      <button
                        onContextMenu={() => setActiveContext(idx)}
                        onClick={() => {
                          setScheduleEntryDialogIsOpen(true);
                          setSelectedScheduleEntry(entry);
                        }}
                        className={`group relative grid h-full ${activeContext === idx ? "z-[30] scale-[1.05] rounded-lg border-none bg-gray-50 brightness-95" : ""} grid-rows-5 gap-0 overflow-hidden border-t border-l p-0 text-sm transition-all duration-200 ease-in-out hover:z-[30] hover:scale-[1.05] hover:cursor-pointer hover:rounded-lg hover:border-none hover:bg-gray-50 hover:brightness-95 [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0`}
                      >
                        {/* Date Number */}
                        <div
                          className={`flex items-center justify-center font-bold ${
                            isWithinMonth ? "" : "text-gray-300"
                          } group-hover:text-primary items-center text-center`}
                        >
                          {formatDate(entry.readingDate, "dd")}
                        </div>

                        {/* Meter Readers */}
                        <div className="col-span-1 flex justify-center">
                          {entry.meterReaders && entry.meterReaders.length > 0 && (
                            <StackedAvatars
                              users={entry.meterReaders
                                .map((meterReader) => ({
                                  id: meterReader.companyId,
                                  image: `${process.env.NEXT_PUBLIC_HRMS_IMAGES_SERVER}/${meterReader.photoUrl}`,
                                  name: meterReader.name,
                                }))
                                .sort((a, b) => (a.name > b.name ? 1 : -1))}
                            />
                          )}
                        </div>

                        <div className="absolute top-0 right-1">
                          {hasSchedule && (
                            <div className="flex items-center justify-center">
                              <CheckCircle2 className="fill-green-500 text-white" />
                              {/* <span className="text-sm text-green-600">Assigned</span> */}
                            </div>
                          )}
                        </div>

                        {/* Due Date */}
                        {Array.isArray(entry.dueDate) ? (
                          <div className="flex items-center justify-center">
                            <Badge className="w-full gap-0 rounded-none bg-blue-200">
                              <span className="text-blue-600">
                                {entry.dueDate.sort(compareAsc).map((day, idx) => (
                                  <span className="overflow-auto font-bold" key={idx}>
                                    {day && idx === 0
                                      ? formatDate(day, "MMM dd")
                                      : "/" + formatDate(day, "MMM dd")}
                                  </span>
                                ))}
                              </span>
                            </Badge>
                          </div>
                        ) : entry.dueDate ? (
                          <div className="flex items-center justify-center">
                            <Badge className="w-full gap-0 rounded-none bg-blue-200">
                              <span className="font-bold text-blue-600">
                                {scheduler.formatDate(entry.dueDate, "MMM dd")}
                              </span>
                            </Badge>
                          </div>
                        ) : null}

                        {/* Disconnection Date */}
                        {Array.isArray(entry.disconnectionDate) ? (
                          <div className="flex items-center justify-center">
                            <Badge className="w-full gap-0 rounded-none bg-rose-100">
                              <div className="text-red-600">
                                {entry.disconnectionDate.sort(compareAsc).map((day, idx) => (
                                  <span className="font-bold" key={idx}>
                                    {day && idx === 0
                                      ? formatDate(day, "MMM dd")
                                      : "/" + formatDate(day, "MMM dd")}
                                  </span>
                                ))}
                              </div>
                            </Badge>
                          </div>
                        ) : entry.disconnectionDate ? (
                          <div className="flex items-center justify-center">
                            <Badge className="w-full gap-0 rounded-none bg-rose-100">
                              <span className="font-bold text-red-600">
                                {scheduler.formatDate(entry.disconnectionDate, "MMM dd")}
                              </span>
                            </Badge>
                          </div>
                        ) : null}

                        {/* Rest Day Indicator */}
                        {(dateIsSunday || dateIsSaturday) &&
                          isWithinMonth &&
                          entry.dueDate &&
                          entry.meterReaders?.length === 0 && (
                            <div className="flex items-center justify-center">
                              <Badge className="w-full gap-0 rounded-none bg-gray-100 text-[5px] font-medium tracking-wide text-gray-600 sm:text-[5px] lg:text-xs">
                                Applicable Rest Day
                              </Badge>
                            </div>
                          )}
                      </button>
                    </ContextMenuTrigger>

                    <ContextMenuContent
                      className="z-[31] w-full rounded bg-white"
                      avoidCollisions
                      alignOffset={10}
                    >
                      <ContextMenuItem
                        className="hover:cursor-pointer"
                        onClick={() => {
                          if (
                            getDate(schedule[idx].readingDate) > 1 &&
                            entry.dueDate !== undefined &&
                            entry.disconnectionDate !== undefined &&
                            !Array.isArray(schedule[idx - 1]?.dueDate) &&
                            !Array.isArray(schedule[idx + 1]?.dueDate)
                          ) {
                            const newSplitDates = [...datesToSplit];
                            newSplitDates.push(entry.readingDate);
                            setDatesToSplit(newSplitDates);
                            setSchedule(scheduler.splitDates(newSplitDates));
                          } else if (
                            getDate(schedule[idx].readingDate) === 1 &&
                            entry.dueDate !== undefined &&
                            entry.disconnectionDate !== undefined &&
                            !Array.isArray(schedule[idx + 1]?.dueDate)
                          ) {
                            toast.error("Error", {
                              description: "Cannot split dates on the beginning of the month!",
                              position: "top-right",
                              duration: 1500,
                            });
                          } else {
                            toast.error("Error", {
                              description:
                                "Cannot split entry, multiple same-day reading dates are not allowed!",
                              position: "top-right",
                              duration: 1500,
                            });
                          }
                        }}
                      >
                        <SquareSplitHorizontalIcon className="text-primary size-5" />
                        <span className="text-sm">Split Dates</span>
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem>
                        <SquarePenIcon className="text-primary size-5" />
                        <span className="text-sm">Modify Dates</span>
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                    </ContextMenuContent>
                  </ContextMenu>
                );
              })}
          </section>
        </main>
      </div>
    </>
  );
}
