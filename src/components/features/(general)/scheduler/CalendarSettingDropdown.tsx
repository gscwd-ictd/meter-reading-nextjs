"use client";
import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { Ellipsis } from "lucide-react";
import { FunctionComponent } from "react";
import { ResetScheduleAlertDialog } from "./ResetScheduleAlertDialog";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { PopulateScheduleAlertDialog } from "./PopulateScheduleAlertDialog";
import { PopulateSchedByDays } from "./PopulateSchedByDays";
import { ManualScheduleAlertDialog } from "./ManualScheduleAlertDialog";
import { Scheduler } from "./useNewScheduler";

type CalendarSettingDropdownProps = {
  scheduler: Scheduler;
};

export const CalendarSettingDropdown: FunctionComponent<CalendarSettingDropdownProps> = ({ scheduler }) => {
  const calendarScheduleDropdownIsOpen = useSchedulesStore((state) => state.calendarScheduleDropdownIsOpen);
  const hasPopulatedMeterReaders = useSchedulesStore((state) => state.hasPopulatedMeterReaders);

  const currentSchedule = useSchedulesStore((state) => state.currentSchedule);
  const setCalendarScheduleDropdownIsOpen = useSchedulesStore(
    (state) => state.setCalendarScheduleDropdownIsOpen,
  );

  return (
    <DropdownMenu
      open={calendarScheduleDropdownIsOpen}
      onOpenChange={() => {
        setCalendarScheduleDropdownIsOpen(!calendarScheduleDropdownIsOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="outline">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent avoidCollisions alignOffset={2} sideOffset={2} align="end">
        {hasPopulatedMeterReaders && (
          <DropdownMenuItem asChild>
            <ResetScheduleAlertDialog />
          </DropdownMenuItem>
        )}

        {!hasPopulatedMeterReaders && (
          <DropdownMenuItem asChild>
            <ManualScheduleAlertDialog schedule={currentSchedule} scheduler={scheduler} />
          </DropdownMenuItem>
        )}

        <DropdownMenuItem asChild>
          <PopulateScheduleAlertDialog schedule={currentSchedule} scheduler={scheduler} />
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <PopulateSchedByDays schedule={currentSchedule} scheduler={scheduler} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
