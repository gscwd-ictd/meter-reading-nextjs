"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parse, setMonth, setYear } from "date-fns";
import { CalendarCheck2Icon, CalendarIcon } from "lucide-react";
import { Button } from "@mr/components/ui/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@mr/components/ui/Popover";
import { cn } from "@mr/lib/utils";
import { Scheduler } from "../scheduler/useScheduler";
import { useSchedulesStore } from "@mr/components/stores/useSchedulesStore";

type MonthYearPickerProps = {
  currentMonthYear: string | null;
  setCurrentMonthYear: (value: string) => void;
  resetOnChange: () => void;
  scheduler: Scheduler;
};

export function MonthYearPicker({
  currentMonthYear,
  setCurrentMonthYear,
  resetOnChange,
  scheduler,
}: MonthYearPickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);

  const updateUrl = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", value);
    router.push(`?${params.toString()}`, { scroll: false });
    resetOnChange();
    scheduler.setCurrentDate(parse(value, "yyyy-MM", new Date()));
    scheduler.setCurrentMonthYear(value);
  };

  const handleMonthClick = (monthIndex: number) => {
    if (selectedYear === null) return;

    const newDate = setYear(setMonth(new Date(), monthIndex), selectedYear);
    const formatted = format(newDate, "yyyy-MM");

    setCurrentMonthYear(formatted);
    updateUrl(formatted);
    setOpen(false);
    setSelectedYear(null); // reset state for next open
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <Popover
      open={open}
      onOpenChange={(val) => {
        setOpen(val);

        if (val) {
          // When opening, retain selected year from currentMonthYear
          if (currentMonthYear) {
            const parsed = parse(currentMonthYear, "yyyy-MM", new Date());
            setSelectedYear(parsed.getFullYear());
          } else {
            setSelectedYear(null);
          }
        } else {
          // On close, clear selection state
          setSelectedYear(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-between text-left font-normal",
            !currentMonthYear && "text-muted-foreground",
          )}
        >
          <span>{currentMonthYear ?? "Pick month"}</span>
          {hasSchedule ? (
            <CalendarCheck2Icon className="ml-2 h-4 w-4 text-green-600 opacity-80" />
          ) : (
            <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="text-muted-foreground mb-2 text-sm font-medium">Select a year</div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {years.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "ghost"}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>

        <div className="text-muted-foreground mb-2 text-sm font-medium">Select a month</div>
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <Button
              key={month}
              variant="ghost"
              onClick={() => handleMonthClick(index)}
              disabled={selectedYear === null}
            >
              {month.slice(0, 3)}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
