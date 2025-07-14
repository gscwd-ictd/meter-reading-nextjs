import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@mr/components/ui/ContextMenu";
import { isSameDay, isSameMonth, isSaturday, isSunday, startOfMonth } from "date-fns";
import { SquarePenIcon, SquareSplitHorizontalIcon } from "lucide-react";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { toast } from "sonner";
import { Scheduler } from "./useScheduler";
import { MeterReadingEntryWithZonebooks } from "@mr/lib/types/schedule";
import { ScheduleEntryTile } from "./ScheduleEntryTile";

type ScheduleEntryContextMenuProps = {
  idx: number;
  entry: MeterReadingEntryWithZonebooks;
  activeContext: number | null;
  currentDate: Date;
  setActiveContext: Dispatch<SetStateAction<number | null>>;
  scheduler: Scheduler;
};

export const ScheduleEntryContextMenu: FunctionComponent<ScheduleEntryContextMenuProps> = ({
  idx,
  activeContext,
  setActiveContext,
  currentDate,
  entry,
  scheduler,
}) => {
  const isWithinMonth = isSameMonth(entry.readingDate, startOfMonth(currentDate));
  const dateIsSunday = isSunday(entry.readingDate);
  const dateIsSaturday = isSaturday(entry.readingDate);
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);

  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setScheduleHasSplittedDates = useSchedulesStore((state) => state.setScheduleHasSplittedDates);

  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);
  const hasPopulatedMeterReaders = useSchedulesStore((state) => state.hasPopulatedMeterReaders);
  const hasFetchedSchedule = useSchedulesStore((state) => state.hasFetchedSchedule);

  // get the reading date where it is the first day of duty of the month
  const firstReadingDate = currentSchedule.find((entry) => entry.dueDate !== undefined)?.readingDate;

  // entry.readingDate is the same with the first duty of the month
  const dayIsFirstReadingDateOfTheMonth = isSameDay(firstReadingDate!, currentSchedule[idx].readingDate);

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
        <div className="h-full w-full border-t border-l [&:nth-child(-n+7)]:border-t-0 [&:nth-child(7n+1)]:border-l-0">
          <ScheduleEntryTile
            activeContext={activeContext}
            setActiveContext={setActiveContext}
            dateIsSaturday={dateIsSaturday}
            dateIsSunday={dateIsSunday}
            entry={entry}
            isWithinMonth={isWithinMonth}
            idx={idx}
            key={idx}
          />
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent
        className="z-[31] w-full rounded bg-white dark:bg-slate-800 dark:ring dark:ring-white"
        avoidCollisions
        alignOffset={10}
      >
        {!dateIsSunday &&
          !dayIsFirstReadingDateOfTheMonth &&
          !hasPopulatedMeterReaders &&
          !hasSchedule &&
          entry.dueDate &&
          entry.disconnectionDate &&
          hasFetchedSchedule && (
            <>
              <ContextMenuItem
                className="hover:cursor-pointer"
                onClick={() => {
                  if (
                    entry.dueDate !== undefined &&
                    entry.disconnectionDate !== undefined &&
                    !Array.isArray(currentSchedule[idx - 1]?.dueDate) &&
                    !Array.isArray(currentSchedule[idx + 1]?.dueDate)
                  ) {
                    const newSplitDates = [...datesToSplit];
                    newSplitDates.push(entry.readingDate);
                    setDatesToSplit(newSplitDates);

                    // merge the calculated schedules and the current schedule
                    const newSchedule = scheduler.splitDates(newSplitDates).map((entry) => {
                      const match = currentSchedule.find(
                        (currentEntry) => currentEntry.readingDate.getTime() === entry.readingDate.getTime(),
                      );

                      return { ...entry, meterReaders: match?.meterReaders || [] };
                    });

                    setScheduleHasSplittedDates(true);

                    setCurrentSchedule(newSchedule);

                    toast.success("Success", {
                      description: "Successfully splitted the dates!",
                      position: "top-right",
                      duration: 1500,
                    });
                  } else if (
                    entry.dueDate !== undefined &&
                    entry.disconnectionDate !== undefined &&
                    !Array.isArray(currentSchedule[idx + 1]?.dueDate)
                  ) {
                    toast.error("Error", {
                      description: "Cannot split entry, multiple same-day reading dates are not allowed!",
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
            </>
          )}

        <ContextMenuItem>
          <SquarePenIcon className="text-primary size-5" />
          <span className="text-sm">Modify Dates</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
