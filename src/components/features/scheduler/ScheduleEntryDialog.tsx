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
import { SplittedDates } from "./entry/SplittedDates";
import { NormalDates } from "./entry/NormalDates";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";
import { CheckCircle, Circle } from "lucide-react";

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
  const setRefetchEntry = useSchedulesStore((state) => state.setRefetchEntry);
  const setSplittedDates = useSchedulesStore((state) => state.setSplittedDates);
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const [scheduleEntryDialogIsOpen, setScheduleEntryDialogIsOpen] = useState<boolean>(false);

  const transformDateToStringIfInvalid = (date: string | Date) =>
    isValidYyyyMmDdOrDate(date) ? date : toParsedDateOnly(date);

  const hasEmptyZonebooks = (entry: MeterReadingEntryWithZonebooks): boolean => {
    if (!entry.meterReaders || entry.meterReaders.length === 0) return true;

    return entry.meterReaders.some((reader) => reader.zoneBooks.length === 0);
  };

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

  const {
    data: scheduleEntry,
    isLoading,
    isFetching,
    isRefetching,
    refetch,
  } = useQuery({
    enabled: scheduleEntryDialogIsOpen,
    queryKey: ["get-schedule-entry-by-id", transformedReadingDate],
    queryFn: async () => {
      try {
        const res = await axios(`${process.env.NEXT_PUBLIC_MR_BE}/schedules?date=${transformedReadingDate}`);

        return res.data as MeterReadingEntryWithZonebooks;
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (scheduleEntry && scheduleEntryDialogIsOpen) {
      setSelectedScheduleEntry(scheduleEntry);
      setRefetchEntry(refetch);
    }
  }, [scheduleEntry, scheduleEntryDialogIsOpen, setSelectedScheduleEntry, refetch, setRefetchEntry]);

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
              {entry.dueDate && entry.meterReaders && entry.meterReaders.length > 0 && (
                <div className="absolute top-1 left-1 z-10">
                  {!hasEmptyZonebooks(entry) ? (
                    <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  ) : (
                    <Circle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                  )}
                </div>
              )}

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
        // onPointerDownOutside={(e) => e.preventDefault()}
        className="max-h-full w-[100vw] min-w-[100%] overflow-auto overflow-y-auto sm:max-h-full sm:w-full sm:min-w-full md:max-h-full md:w-[80%] md:min-w-[80%] lg:max-h-[90%] lg:min-w-[65%]"
      >
        <DialogHeader className="space-y-0">
          <DialogTitle className="flex flex-col gap-0 text-start">
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              Reading Date:{" "}
              {entry && !selectedScheduleEntry
                ? format(entry.readingDate!, "MMM dd, yyyy")
                : entry && selectedScheduleEntry
                  ? format(selectedScheduleEntry?.readingDate!, "MMM dd, yyyy")
                  : null}
            </div>

            <div className="flex flex-col text-sm sm:flex-row sm:gap-6">
              {Array.isArray(selectedScheduleEntry?.dueDate) &&
                Array.isArray(selectedScheduleEntry.disconnectionDate) && (
                  <SplittedDates
                    dueDates={selectedScheduleEntry.dueDate}
                    disconnectionDates={selectedScheduleEntry.disconnectionDate}
                  />
                )}

              {selectedScheduleEntry &&
                !Array.isArray(selectedScheduleEntry?.dueDate) &&
                !Array.isArray(selectedScheduleEntry.disconnectionDate) && (
                  <NormalDates
                    dueDate={selectedScheduleEntry.dueDate!}
                    disconnectionDate={selectedScheduleEntry.disconnectionDate!}
                  />
                )}
            </div>
          </DialogTitle>
          <DialogDescription className="text-start">
            <span className="text-[0.5rem] sm:text-[0.5rem] md:text-[0.5rem] lg:text-xs">
              List of Meter Readers with their zone books
            </span>
          </DialogDescription>
        </DialogHeader>

        {isLoading || isFetching || isRefetching ? (
          <div className="flex h-full w-full justify-center">
            Loading Meter Readers <LoadingSpinner />
          </div>
        ) : (
          <div className="relative">
            <MeterReaderEntryDataTable
              meterReaders={selectedScheduleEntry?.meterReaders ? selectedScheduleEntry!.meterReaders : []}
            />
          </div>
        )}
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
