import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { motion } from "framer-motion";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { ZonebookStatusIndicator } from "../zonebook/ZonebookStatusIndicator";
import { getDayFromDate } from "@mr/lib/functions/handleDateArrayOrObject";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { Badge } from "@mr/components/ui/Badge";
import { isSameDay, isToday, parseISO } from "date-fns";
import { ShortSplittedDates } from "./entry/ShortSplittedDates";
import { ShortNormalDates } from "./entry/ShortNormalDates";

type ScheduleEntryTileProps = {
  activeContext: number | null;
  setActiveContext: Dispatch<SetStateAction<number | null>>;
  entry: MeterReadingEntryWithZonebooks;
  isWithinMonth: boolean;
  dateIsSunday: boolean;
  dateIsSaturday: boolean;
  idx: number;
};

export const ScheduleEntryTile: FunctionComponent<ScheduleEntryTileProps> = ({
  activeContext,
  dateIsSaturday,
  dateIsSunday,
  entry,
  idx,
  isWithinMonth,
  setActiveContext,
}) => {
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setScheduleEntryDialogIsOpen = useSchedulesStore((state) => state.setScheduleEntryDialogIsOpen);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);

  // get the reading date where it is the first day of duty of the month
  const firstReadingDate = currentSchedule.find((entry) => entry.dueDate !== undefined)?.readingDate;

  // entry.readingDate is the same with the first duty of the month
  const dayIsFirstReadingDateOfTheMonth = isSameDay(firstReadingDate!, currentSchedule[idx].readingDate);

  const hasPreviousWithDueAndDisconnection = (
    schedule: MeterReadingEntryWithZonebooks[],
    selectedReadingDate: string,
  ): boolean => {
    const selectedDate = parseISO(selectedReadingDate);

    // Find index of the selected reading date
    const index = schedule.findIndex((entry) => isSameDay(entry.readingDate, selectedDate));

    if (index <= 0) {
      return false; // No previous entry
    }

    const previousEntry = schedule[index - 1];

    return Boolean(previousEntry?.dueDate && previousEntry?.disconnectionDate);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.05, ease: "easeOut" }}
      onContextMenu={() => setActiveContext(idx)}
      onClick={(e) => {
        if (
          (isWithinMonth && hasSchedule && dayIsFirstReadingDateOfTheMonth) ||
          (isWithinMonth &&
            hasSchedule &&
            !dayIsFirstReadingDateOfTheMonth &&
            hasPreviousWithDueAndDisconnection(currentSchedule, entry.readingDate.toISOString()))
        ) {
          setSelectedScheduleEntry(entry);
          setScheduleEntryDialogIsOpen(true);
        } else {
          e.preventDefault();
        }
      }}
      className={`group ${isToday(entry.readingDate) ? "bg-blue-100 dark:bg-slate-900" : "bg-white dark:bg-transparent"} relative grid h-full w-full grid-rows-5 gap-0 overflow-hidden p-0 text-sm transition-all duration-200 ease-in-out hover:z-[30] hover:cursor-pointer hover:rounded-lg hover:border-none hover:bg-gray-50 hover:brightness-95 dark:hover:bg-slate-800 ${activeContext === idx ? "z-[30] scale-[1.05] rounded-lg border-none bg-gray-50 brightness-95 dark:bg-slate-800" : ""} `}
    >
      {isWithinMonth && (
        <>
          {entry.dueDate && entry.meterReaders && entry.meterReaders.length > 0 && (
            <ZonebookStatusIndicator entry={entry} />
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

          {Array.isArray(entry?.dueDate) && Array.isArray(entry.disconnectionDate) && (
            <ShortSplittedDates dueDates={entry.dueDate} disconnectionDates={entry.disconnectionDate} />
          )}

          {entry && !Array.isArray(entry?.dueDate) && !Array.isArray(entry.disconnectionDate) && (
            <ShortNormalDates dueDate={entry.dueDate!} disconnectionDate={entry.disconnectionDate!} />
          )}

          {/* Rest Day Indicator */}
          {(dateIsSunday || dateIsSaturday) &&
            isWithinMonth &&
            entry.dueDate &&
            entry.meterReaders?.length === 0 && (
              <div className="flex items-center justify-center">
                <Badge className="w-full gap-0 rounded-none bg-transparent text-[0.2rem] font-medium tracking-wide text-gray-600 sm:text-[0.2rem] md:text-[0.6rem] lg:text-xs dark:bg-transparent">
                  Applicable Rest Day
                </Badge>
              </div>
            )}
        </>
      )}
    </motion.button>
  );
};
