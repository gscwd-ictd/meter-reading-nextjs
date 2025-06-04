import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@mr/components/ui/ContextMenu";
import { MeterReadingEntry } from "@mr/lib/types/schedule";
import { getDate, isSameMonth, isSaturday, isSunday, startOfMonth } from "date-fns";
import { SquarePenIcon, SquareSplitHorizontalIcon } from "lucide-react";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { ScheduleEntryDialog } from "./ScheduleEntryDialog";
import { toast } from "sonner";
import { Scheduler } from "./useScheduler";

type ScheduleEntryContextMenuProps = {
  idx: number;
  entry: MeterReadingEntry;
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
  const hasSchedule = entry.meterReaders?.find(
    (mr) => Array.isArray(mr.zonebooks) && mr.zonebooks.length > 0,
  );

  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);

  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);
  const setDatesToSplit = useSchedulesStore((state) => state.setDatesToSplit);

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
          <ScheduleEntryDialog
            activeContext={activeContext}
            setActiveContext={setActiveContext}
            dateIsSaturday={dateIsSaturday}
            dateIsSunday={dateIsSunday}
            entry={entry}
            hasSchedule={hasSchedule}
            isWithinMonth={isWithinMonth}
            idx={idx}
            key={idx}
          />
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent className="z-[31] w-full rounded bg-white" avoidCollisions alignOffset={10}>
        {!dateIsSunday && (
          <ContextMenuItem
            className="hover:cursor-pointer"
            onClick={() => {
              if (
                getDate(currentSchedule[idx].readingDate) > 1 &&
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

                setCurrentSchedule(newSchedule);
              } else if (
                getDate(currentSchedule[idx].readingDate) === 1 &&
                entry.dueDate !== undefined &&
                entry.disconnectionDate !== undefined &&
                !Array.isArray(currentSchedule[idx + 1]?.dueDate)
              ) {
                toast.error("Error", {
                  description: "Cannot split dates on the beginning of the month!",
                  position: "top-right",
                  duration: 1500,
                });
              } else {
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
        )}
        {!dateIsSunday && <ContextMenuSeparator />}
        <ContextMenuItem>
          <SquarePenIcon className="text-primary size-5" />
          <span className="text-sm">Modify Dates</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};
