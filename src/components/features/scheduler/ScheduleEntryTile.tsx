import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { motion } from "framer-motion";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { ZonebookStatusIndicator } from "../zonebook/ZonebookStatusIndicator";
import { getDayFromDate } from "@mr/lib/functions/handleDateArrayOrObject";
import { StackedAvatars } from "@mr/components/ui/StackedAvatars";
import { Badge } from "@mr/components/ui/Badge";
import { compareAsc, formatDate } from "date-fns";

type ScheduleEntryTileProps = {
  activeContext: number | null;
  setActiveContext: Dispatch<SetStateAction<number | null>>;
  entry: MeterReadingEntryWithZonebooks;
  isWithinMonth: boolean;
  dateIsSunday: boolean;
  dateIsSaturday: boolean;
  idx: number | null;
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
  const setScheduleEntryDialogIsOpen = useSchedulesStore((state) => state.setScheduleEntryDialogIsOpen);
  const setSelectedScheduleEntry = useSchedulesStore((state) => state.setSelectedScheduleEntry);

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.05, ease: "easeOut" }}
      onContextMenu={() => setActiveContext(idx)}
      onClick={(e) => {
        if (isWithinMonth && hasSchedule) {
          setSelectedScheduleEntry(entry);
          setScheduleEntryDialogIsOpen(true);
        } else {
          e.preventDefault();
        }
      }}
      className={`group relative grid h-full w-full grid-rows-5 gap-0 overflow-hidden p-0 text-sm transition-all duration-200 ease-in-out hover:z-[30] hover:cursor-pointer hover:rounded-lg hover:border-none hover:bg-gray-50 hover:brightness-95 dark:hover:bg-slate-800 ${activeContext === idx ? "z-[30] scale-[1.05] rounded-lg border-none bg-gray-50 brightness-95 dark:bg-slate-800" : ""} `}
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
          {/* Due Date */}
          {Array.isArray(entry.dueDate) ? (
            <div className="flex items-center justify-center">
              <Badge className="w-full gap-0 rounded-none bg-transparent">
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
              <Badge className="w-full gap-0 rounded-none bg-transparent">
                <span className="font-bold text-blue-600 dark:text-blue-600">
                  {formatDate(entry.dueDate, "MMM dd")}
                </span>
              </Badge>
            </div>
          ) : null}
          {/* Disconnection Date */}
          {Array.isArray(entry.disconnectionDate) ? (
            <div className="flex items-center justify-center">
              <Badge className="w-full gap-0 rounded-none bg-transparent">
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
              <Badge className="w-full gap-0 rounded-none bg-transparent">
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
                <Badge className="w-full gap-0 rounded-none bg-transparent text-[5px] font-medium tracking-wide text-gray-600 sm:text-[5px] lg:text-xs dark:bg-transparent">
                  Applicable Rest Day
                </Badge>
              </div>
            )}
        </>
      )}
    </motion.button>
  );
};
