"use client";

import * as React from "react";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@mr/lib/utils";
import { Button } from "@mr/components/ui/Button";
import { Calendar } from "@mr/components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@mr/components/ui/DropdownMenu";

interface DateRangePickerWithPresetsProps {
  className?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
}

const presets = [
  { label: "Today", getValue: () => ({ from: new Date(), to: new Date() }) },
  { label: "Yesterday", getValue: () => ({ from: subDays(new Date(), 1), to: subDays(new Date(), 1) }) },
  { label: "Last 7 days", getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }) },
  { label: "Last 30 days", getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }) },
  { label: "This week", getValue: () => ({ from: startOfWeek(new Date()), to: endOfWeek(new Date()) }) },
  { label: "This month", getValue: () => ({ from: startOfMonth(new Date()), to: new Date() }) },
  {
    label: "Last month",
    getValue: () => {
      const now = new Date();
      const firstDayLastMonth = startOfMonth(subMonths(now, 1));
      const lastDayLastMonth = endOfMonth(subMonths(now, 1));
      return { from: firstDayLastMonth, to: lastDayLastMonth };
    },
  },
];

export function DateRangePickerWithPresets({
  className,
  date,
  onDateChange,
}: DateRangePickerWithPresetsProps) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className={cn("flex flex-col gap-2 sm:flex-row", className)}>
      {/* Presets Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`${date?.from || date?.to ? "text-gray-400" : "text-gray-700"} h-[2.5rem] justify-between text-xs sm:w-[120px] sm:text-sm`}
            size="sm"
          >
            <span>Presets</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[160px]">
          {presets.map((preset) => (
            <DropdownMenuItem
              key={preset.label}
              onClick={() => onDateChange(preset.getValue())}
              className="text-sm"
            >
              {preset.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "h-[2.5rem] min-w-0 flex-1 justify-start px-3 text-left font-normal",
              !date && "text-muted-foreground",
            )}
            size="sm"
          >
            <CalendarIcon className="h-4 w-4 flex-shrink-0" />
            {date?.from ? (
              date.to ? (
                <span className="truncate text-xs">
                  {format(date.from, "MMM dd")} - {format(date.to, "MMM dd, y")}
                </span>
              ) : (
                <span className="truncate text-xs">{format(date.from, "MMM dd, y")}</span>
              )
            ) : (
              <span className="truncate text-xs sm:text-sm">Select dates</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align={isMobile ? "center" : "start"}
          side={isMobile ? "bottom" : "bottom"}
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
