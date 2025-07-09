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
} from "@mr/components/ui/Dialog";
import { format } from "date-fns";
import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { MeterReaderEntryDataTable } from "../data-tables/meter-reader-entry/MeterReaderEntryDataTable";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { isValidYyyyMmDdOrDate, toParsedDateOnly } from "@mr/lib/functions/handleDateArrayOrObject";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SplittedDates } from "./entry/SplittedDates";
import { NormalDates } from "./entry/NormalDates";
import { LoadingSpinner } from "@mr/components/ui/LoadingSpinner";

export const ScheduleEntryDialog: FunctionComponent = () => {
  const selectedScheduleEntry = useSchedulesStore((state) => state.selectedScheduleEntry);
  const scheduleEntryDialogIsOpen = useSchedulesStore((state) => state.scheduleEntryDialogIsOpen);
  const setScheduleEntryDialogIsOpen = useSchedulesStore((state) => state.setScheduleEntryDialogIsOpen);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);
  const setScheduleEntryIsSplitted = useSchedulesStore((state) => state.setScheduleEntryIsSplitted);
  const setRefetchEntry = useSchedulesStore((state) => state.setRefetchEntry);
  const setSplittedDates = useSchedulesStore((state) => state.setSplittedDates);

  const transformDateToStringIfInvalid = (date: string | Date) =>
    isValidYyyyMmDdOrDate(date) ? date : toParsedDateOnly(date);

  const transformedReadingDate = useMemo(() => {
    if (!selectedScheduleEntry?.readingDate) return undefined;
    return format(transformDateToStringIfInvalid(selectedScheduleEntry.readingDate), "yyyy-MM-dd");
  }, [selectedScheduleEntry?.readingDate]);

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
    enabled: scheduleEntryDialogIsOpen && !!transformedReadingDate,
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
      <DialogContent className="max-h-full w-[100vw] min-w-[100%] overflow-auto overflow-y-auto sm:max-h-full sm:w-full sm:min-w-full md:max-h-full md:w-[80%] md:min-w-[80%] lg:max-h-[90%] lg:min-w-[65%]">
        <DialogHeader className="space-y-0">
          <DialogTitle className="flex flex-col gap-0 text-start">
            <div className="text-lg font-bold text-gray-800 dark:text-white">
              Reading Date:{" "}
              {selectedScheduleEntry && selectedScheduleEntry.readingDate
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
