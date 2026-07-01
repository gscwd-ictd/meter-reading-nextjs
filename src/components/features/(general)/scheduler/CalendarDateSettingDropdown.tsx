import { Button } from "@mr/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";
import { MeterReadingSchedule } from "@mr/lib/types/schedule";
import { SettingsIcon, CheckIcon } from "lucide-react";
import { FunctionComponent, useCallback } from "react";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { CustomDaySelectionSetting } from "@mr/components/ui/dropdowns/CustomDaySelectionSetting";
import { Scheduler } from "./useNewScheduler";

type CalendarDateSettingDropdownProps = {
  schedule: MeterReadingSchedule[];
  scheduler: Scheduler;
};

export const CalendarDateSettingDropdown: FunctionComponent<CalendarDateSettingDropdownProps> = ({
  schedule,
  scheduler,
}) => {
  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const setNoDueDiscDays = useSchedulesStore((state) => state.setNoDueDiscDays);
  const hasFetchedSchedule = useSchedulesStore((state) => state.hasFetchedSchedule);
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const noDueDiscDays = useSchedulesStore((state) => state.noDueDiscDays);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={hasFetchedSchedule && hasSchedule ? true : false}
          className="disabled:cursor-not-allowed"
        >
          <SettingsIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="text-primary w-[16rem] p-2 text-xs">
          {hasFetchedSchedule && hasSchedule
            ? "Cannot change this setting for this month"
            : " No due dates shall fall on the following:"}
        </div>

        {hasFetchedSchedule && !hasSchedule && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="-mb-2 text-xs text-green-400">Preset</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setNoDueDiscDays([0, 6]);
                  setCurrentSchedule(scheduler.splitDates(datesToSplit));
                }}
                className="flex flex-col items-start gap-0 hover:cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  Weekends & Holidays
                  {JSON.stringify(noDueDiscDays) === JSON.stringify([0, 6]) && (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <span className="w-[16rem] text-xs text-gray-500">Default</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  setNoDueDiscDays([0, 5, 6]);

                  setCurrentSchedule(scheduler.splitDates(datesToSplit));
                }}
                className="flex flex-col items-start gap-0 hover:cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2 text-sm">
                  Fridays, Weekends, & Holidays
                  {JSON.stringify(noDueDiscDays) === JSON.stringify([0, 5, 6]) && (
                    <CheckIcon className="h-4 w-4 text-green-600" />
                  )}
                </div>
                <span className="w-[16rem] text-xs text-gray-500">
                  Due to four-day workweek arrangement (OGM MEMORANDUM 24, S. 2026)
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className="-mb-2 text-xs text-green-400">Custom</DropdownMenuLabel>
              <CustomDaySelectionSetting scheduler={scheduler} />
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
