"use client";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../DropdownMenu";
import { Button } from "../Button";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";
import { useCallback, useState, useEffect } from "react";
import { Scheduler } from "@mr/components/features/(general)/scheduler/useScheduler";

type CustomDaySelecionSettingProps = {
  scheduler: Scheduler;
};

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

export const CustomDaySelectionSetting: React.FC<CustomDaySelecionSettingProps> = ({ scheduler }) => {
  const noDueDiscDays = useSchedulesStore((state) => state.noDueDiscDays);
  const setNoDueDiscDays = useSchedulesStore((state) => state.setNoDueDiscDays);
  const setCurrentSchedule = useSchedulesStore((state) => state.setCurrentSchedule);
  const datesToSplit = useSchedulesStore((state) => state.datesToSplit);
  const [isSubOpen, setIsSubOpen] = useState(false);

  // Local state for temporary selections
  const [tempSelectedDays, setTempSelectedDays] = useState<number[]>(noDueDiscDays);

  // Reset temp selection when submenu opens
  useEffect(() => {
    if (isSubOpen) {
      setTempSelectedDays(noDueDiscDays);
    }
  }, [isSubOpen, noDueDiscDays]);

  const handleDaySelection = useCallback(
    (dayValue: number, checked: boolean) => {
      let newDays: number[];
      if (checked) {
        // Check if selecting this day would result in selecting all 7 days
        if (tempSelectedDays.length + 1 === DAYS_OF_WEEK.length) {
          return; // Prevent selection
        }
        newDays = [...tempSelectedDays, dayValue].sort((a, b) => a - b);
      } else {
        newDays = tempSelectedDays.filter((d) => d !== dayValue);
      }
      setTempSelectedDays(newDays);
    },
    [tempSelectedDays],
  );

  const handleApply = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setNoDueDiscDays(tempSelectedDays);
      setCurrentSchedule(scheduler.splitDates(datesToSplit));
      setIsSubOpen(false);
    },
    [tempSelectedDays, setNoDueDiscDays, setCurrentSchedule, scheduler, datesToSplit],
  );

  const handleCancel = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setTempSelectedDays(noDueDiscDays);
      setIsSubOpen(false);
    },
    [noDueDiscDays],
  );

  const isDaySelected = useCallback(
    (dayValue: number) => {
      return tempSelectedDays.includes(dayValue);
    },
    [tempSelectedDays],
  );

  const isDayDisabled = useCallback(
    (dayValue: number) => {
      // Disable the checkbox if selecting it would select all 7 days
      return !isDaySelected(dayValue) && tempSelectedDays.length + 1 === DAYS_OF_WEEK.length;
    },
    [tempSelectedDays, isDaySelected],
  );

  const hasChanges = JSON.stringify(tempSelectedDays) !== JSON.stringify(noDueDiscDays);

  return (
    <DropdownMenuSub open={isSubOpen} onOpenChange={setIsSubOpen}>
      <DropdownMenuSubTrigger className="h-full justify-center">
        <div className="flex flex-col items-center gap-0 text-center">
          <div className="flex w-full items-center justify-start">
            <span>Specific Days</span>
          </div>
          <div className="flex w-full items-start justify-start gap-1">
            <span className="text-xs text-gray-500">
              {noDueDiscDays.length > 0
                ? noDueDiscDays.map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label).join(", ")
                : "None"}{" "}
              & Holidays
            </span>
            {JSON.stringify(noDueDiscDays) !==
              JSON.stringify([0, 6] || JSON.stringify(noDueDiscDays) !== JSON.stringify([0, 5, 6])) && (
              <CheckIcon className="h-4 w-4 text-green-600" />
            )}
          </div>
        </div>
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className="w-[16rem]">
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Select days to exclude
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {DAYS_OF_WEEK.map((day) => (
          <DropdownMenuCheckboxItem
            key={day.value}
            checked={isDaySelected(day.value)}
            disabled={isDayDisabled(day.value)}
            onCheckedChange={(checked) => handleDaySelection(day.value, checked)}
            onSelect={(e) => {
              // Prevent the dropdown from closing when selecting items
              e.preventDefault();
            }}
          >
            {day.label}
            {isDayDisabled(day.value) && (
              <span className="text-muted-foreground ml-2 text-xs">(would select all)</span>
            )}
          </DropdownMenuCheckboxItem>
        ))}
        <DropdownMenuSeparator />
        <div className="text-muted-foreground px-2 py-1.5 text-xs">
          Selected:{" "}
          {tempSelectedDays.length > 0
            ? tempSelectedDays.map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label).join(", ")
            : "None"}
          {tempSelectedDays.length === DAYS_OF_WEEK.length - 1 && (
            <span className="ml-2 text-amber-600">(max selection reached)</span>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="flex gap-2 px-2 py-2">
          <Button variant="outline" size="sm" onClick={handleCancel} className="flex-1 dark:text-white">
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            disabled={!hasChanges}
            className="flex-1 dark:text-white"
          >
            Apply
          </Button>
        </div>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};
