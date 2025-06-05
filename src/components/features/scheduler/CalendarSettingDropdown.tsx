"use client";
import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { Ellipsis } from "lucide-react";
import { FunctionComponent } from "react";
import { Scheduler } from "./useScheduler";
import { ResetScheduleAlertDialog } from "./ResetScheduleAlertDialog";
import { SubmitScheduleAlertDialog } from "./SubmitScheduleAlertDialog";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";

type CalendarSettingDropdownProps = {
  scheduler: Scheduler;
};

export const CalendarSettingDropdown: FunctionComponent<CalendarSettingDropdownProps> = ({ scheduler }) => {
  const calendarScheduleDropdownIsOpen = useSchedulesStore((state) => state.calendarScheduleDropdownIsOpen);
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
        <DropdownMenuItem asChild>
          <ResetScheduleAlertDialog scheduler={scheduler} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <SubmitScheduleAlertDialog />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
