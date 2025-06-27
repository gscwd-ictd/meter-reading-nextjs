/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */

"use client";

import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mr/components/ui/Dialog";
import { compareAsc, format, formatDate } from "date-fns";
import { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { MeterReaderEntryDataTable } from "../data-tables/meter-reader-entry/MeterReaderEntryDataTable";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { AlertTriangleIcon, CalendarIcon } from "lucide-react";
import { Badge } from "@mr/components/ui/Badge";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import {
  getDayFromDate,
  isValidYyyyMmDdOrDate,
  toParsedDateOnly,
} from "@mr/lib/functions/handleDateArrayOrObject";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type ScheduleEntryDialogProps = {
  activeContext: number | null;
  setActiveContext: Dispatch<SetStateAction<number | null>>;
  entry: MeterReadingEntryWithZonebooks;
  isWithinMonth: boolean;
  dateIsSunday: boolean;
  dateIsSaturday: boolean;
  idx: number | null;
};

export const ScheduleEntryDialog: FunctionComponent<ScheduleEntryDialogProps> = ({
  activeContext,
  setActiveContext,
  isWithinMonth,
  dateIsSaturday,
  dateIsSunday,
  idx,
  entry,
}) => {
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const setScheduleEntryIsSplitted = useSchedulesStore((state) => state.setScheduleEntryIsSplitted);
  const setSplittedDates = useSchedulesStore((state) => state.setSplittedDates);
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const [scheduleEntryDialogIsOpen, setScheduleEntryDialogIsOpen] = useState<boolean>(false);

  const transformDateToStringIfInvalid = (date: string | Date) =>
    isValidYyyyMmDdOrDate(date) ? date : toParsedDateOnly(date);

  const transformedReadingDate = format(transformDateToStringIfInvalid(entry.readingDate), "yyyy-MM-dd");

  // if schedule entry is splitted, this only sets the schedule entry/singular/selected day splitted dates
  useEffect(() => {
    if (
      Array.isArray(selectedScheduleEntry?.dueDate) &&
      Array.isArray(selectedScheduleEntry?.disconnectionDate)
    ) {
      setScheduleEntryIsSplitted(true);
      const dueDates = [...selectedScheduleEntry?.dueDate];
      const disconnectionDates = [...selectedScheduleEntry?.disconnectionDate];

      setSplittedDates([
        { dueDate: dueDates[0], disconnectionDate: disconnectionDates[0] },
        { dueDate: dueDates[1], disconnectionDate: disconnectionDates[1] },
      ]);
    } else if (
      !Array.isArray(selectedScheduleEntry?.dueDate) &&
      !Array.isArray(selectedScheduleEntry?.disconnectionDate)
    )
      setScheduleEntryIsSplitted(false);
  }, [
    selectedScheduleEntry?.dueDate,
    selectedScheduleEntry?.disconnectionDate,
    setScheduleEntryIsSplitted,
    setSplittedDates,
  ]);

  const { data: scheduleEntry } = useQuery({
    enabled: scheduleEntryDialogIsOpen,
    queryKey: ["get-schedule-entry-by-id", transformedReadingDate],
    queryFn: async () => {
      console.log(transformedReadingDate);
      try {
        const res = await axios(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${transformedReadingDate}`);
        console.log(transformedReadingDate, ": ", res.data);
        return res.data as MeterReadingEntryWithZonebooks;
      } catch (error) {
        console.log(error);
      }
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (scheduleEntry && scheduleEntryDialogIsOpen) {
      setSelectedScheduleEntry(scheduleEntry);
    }
  }, [scheduleEntry, scheduleEntryDialogIsOpen, setSelectedScheduleEntry]);

  return (
    <Dialog
      open={scheduleEntryDialogIsOpen}
      onOpenChange={() => {
        setScheduleEntryDialogIsOpen(!scheduleEntryDialogIsOpen);
        setSelectedScheduleEntry(null);
      }}
      modal
    >
      <DialogTrigger asChild className="h-full w-full">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.05, ease: "easeOut" }}
          onContextMenu={() => setActiveContext(idx)}
          onClick={(e) => {
            if (isWithinMonth && hasSchedule) {
              setScheduleEntryDialogIsOpen(true);
            } else {
              e.preventDefault();
            }
          }}
          className={`group relative grid h-full grid-rows-5 gap-0 overflow-hidden p-0 text-sm transition-all duration-200 ease-in-out hover:z-[30] hover:cursor-pointer hover:rounded-lg hover:border-none hover:bg-gray-50 hover:brightness-95 dark:hover:bg-slate-800 ${activeContext === idx ? "z-[30] scale-[1.05] rounded-lg border-none bg-gray-50 brightness-95 dark:bg-slate-800" : ""} `}
        >
          {isWithinMonth && (
            <>
              {/* Date Number */}

              <div
                className={`flex items-center justify-center px-0 font-bold sm:justify-center sm:px-0 md:justify-center md:px-0 lg:justify-end lg:px-2 ${
                  isWithinMonth ? "" : "text-gray-300"
                } group-hover:text-primary items-center text-center`}
              >
                {getDayFromDate(entry.readingDate)}
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

              {/* Due Date */}
              {Array.isArray(entry.dueDate) ? (
                <div className="flex items-center justify-center">
                  <Badge className="w-full gap-0 rounded-none bg-blue-200 dark:bg-transparent">
                    <span className="text-blue-600 dark:text-blue-600">
                      {entry.dueDate.sort(compareAsc).map((day, idx) => (
                        <span className="overflow-auto font-bold" key={idx}>
                          {day && idx === 0 ? formatDate(day, "MMM dd") : "/" + formatDate(day, "MMM dd")}
                        </span>
                      ))}
                    </span>
                  </Badge>
                </div>
              ) : entry.dueDate ? (
                <div className="flex items-center justify-center">
                  <Badge className="w-full gap-0 rounded-none bg-blue-200 dark:bg-transparent">
                    <span className="font-bold text-blue-600 dark:text-blue-600">
                      {formatDate(entry.dueDate, "MMM dd")}
                    </span>
                  </Badge>
                </div>
              ) : null}
              {/* Disconnection Date */}
              {Array.isArray(entry.disconnectionDate) ? (
                <div className="flex items-center justify-center">
                  <Badge className="w-full gap-0 rounded-none bg-rose-100 dark:bg-transparent">
                    <div className="text-red-600 dark:text-rose-600">
                      {entry.disconnectionDate.sort(compareAsc).map((day, idx) => (
                        <span className="font-bold" key={idx}>
                          {day && idx === 0 ? formatDate(day, "MMM dd") : "/" + formatDate(day, "MMM dd")}
                        </span>
                      ))}
                    </div>
                  </Badge>
                </div>
              ) : entry.disconnectionDate ? (
                <div className="flex items-center justify-center">
                  <Badge className="w-full gap-0 rounded-none bg-rose-100 dark:bg-transparent">
                    <span className="font-bold text-red-600 dark:text-rose-600">
                      {formatDate(entry.disconnectionDate, "MMM dd")}
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
                    <Badge className="w-full gap-0 rounded-none bg-gray-100 text-[5px] font-medium tracking-wide text-gray-600 sm:text-[5px] lg:text-xs dark:bg-transparent">
                      Applicable Rest Day
                    </Badge>
                  </div>
                )}
            </>
          )}
        </motion.button>
      </DialogTrigger>

      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-full w-[100vw] min-w-[100%] overflow-auto overflow-y-auto sm:max-h-full sm:w-full sm:min-w-full md:max-h-full md:w-[80%] md:min-w-[80%] lg:max-h-[90%] lg:min-w-[65%]"
      >
        <DialogHeader className="space-y-0">
          <DialogTitle>
            <div className="text-lg font-bold text-gray-800">
              {entry && !selectedScheduleEntry
                ? format(entry.readingDate!, "MMM dd, yyyy")
                : entry && selectedScheduleEntry
                  ? format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")
                  : null}
            </div>

            <div className="flex flex-col text-sm sm:flex-row sm:gap-6">
              <div className="text-primary flex items-center gap-2 font-medium dark:text-blue-400">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  Due:{" "}
                  {entry && !selectedScheduleEntry?.dueDate ? (
                    <>
                      {entry?.dueDate && Array.isArray(entry.dueDate) ? (
                        <span className="flex gap-2">
                          {entry.dueDate.map((day, idx) => {
                            if (idx === 0) return ` ${format(day, "MMM dd, yyyy")} / `;
                            return format(day, "MMM dd, yyyy");
                          })}
                        </span>
                      ) : entry && entry.dueDate && !Array.isArray(entry.dueDate) ? (
                        format(entry.dueDate, "MMM dd, yyyy")
                      ) : null}
                    </>
                  ) : entry && selectedScheduleEntry && selectedScheduleEntry?.dueDate ? (
                    <>
                      {selectedScheduleEntry?.dueDate && Array.isArray(selectedScheduleEntry.dueDate) ? (
                        <span className="flex gap-2">
                          {selectedScheduleEntry.dueDate.map((day, idx) => {
                            if (idx === 0) return ` ${format(day, "MMM dd, yyyy")} / `;
                            return format(day, "MMM dd, yyyy");
                          })}
                        </span>
                      ) : selectedScheduleEntry &&
                        selectedScheduleEntry.dueDate &&
                        !Array.isArray(selectedScheduleEntry.dueDate) ? (
                        format(selectedScheduleEntry.dueDate, "MMM dd, yyyy")
                      ) : null}
                    </>
                  ) : null}
                </span>
              </div>
              <div className="flex items-center gap-2 font-medium text-red-500">
                <AlertTriangleIcon className="h-4 w-4" />
                <span>
                  Disconnection:{" "}
                  {entry && !selectedScheduleEntry?.disconnectionDate ? (
                    <>
                      {entry?.disconnectionDate && Array.isArray(entry.disconnectionDate) ? (
                        <span className="flex gap-2">
                          {entry.disconnectionDate.map((day, idx) => {
                            if (idx === 0) return ` ${format(day, "MMM dd, yyyy")} / `;
                            return format(day, "MMM dd, yyyy");
                          })}
                        </span>
                      ) : entry && entry.disconnectionDate && !Array.isArray(entry.disconnectionDate) ? (
                        format(entry.disconnectionDate, "MMM dd, yyyy")
                      ) : null}
                    </>
                  ) : entry && selectedScheduleEntry && selectedScheduleEntry.disconnectionDate ? (
                    <>
                      {selectedScheduleEntry?.disconnectionDate &&
                      Array.isArray(selectedScheduleEntry.disconnectionDate) ? (
                        <span className="flex gap-2">
                          {selectedScheduleEntry.disconnectionDate.map((day, idx) => {
                            if (idx === 0) return ` ${format(day, "MMM dd, yyyy")} / `;
                            return format(day, "MMM dd, yyyy");
                          })}
                        </span>
                      ) : selectedScheduleEntry &&
                        selectedScheduleEntry.disconnectionDate &&
                        !Array.isArray(selectedScheduleEntry.disconnectionDate) ? (
                        format(selectedScheduleEntry.disconnectionDate, "MMM dd, yyyy")
                      ) : null}
                    </>
                  ) : null}
                </span>
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            <span>List of Meter Readers with their respective zoneBooks</span>
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <MeterReaderEntryDataTable
            meterReaders={selectedScheduleEntry?.meterReaders ? selectedScheduleEntry!.meterReaders : []}
          />
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
