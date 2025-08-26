"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parse, setMonth, setYear } from "date-fns";
import { CalendarCheck2Icon, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const hasSchedule = useSchedulesStore((state) => state.hasSchedule);
  const reset = useSchedulesStore((state) => state.reset);
  const refetchData = useSchedulesStore((state) => state.refetchData);

  // Parse current selection
  const selectedDate = currentMonthYear ? parse(currentMonthYear, "yyyy-MM", new Date()) : null;
  const selectedYear = selectedDate?.getFullYear();
  const selectedMonth = selectedDate?.getMonth();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const updateUrl = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", value);
    router.push(`?${params.toString()}`, { scroll: false });
    resetOnChange();
    scheduler.setCurrentDate(parse(value, "yyyy-MM", new Date()));
    scheduler.setCurrentMonthYear(value);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setYear(setMonth(new Date(), monthIndex), currentYear);
    const formatted = format(newDate, "yyyy-MM");

    reset();
    refetchData?.();
    setCurrentMonthYear(formatted);
    updateUrl(formatted);
    setOpen(false);
  };

  const handleYearChange = (increment: number) => {
    setCurrentYear((prev) => prev + increment);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[200px] justify-start text-left font-normal",
            !currentMonthYear && "text-muted-foreground",
          )}
        >
          {hasSchedule ? (
            <CalendarCheck2Icon className="mr-2 h-4 w-4 text-green-600 opacity-80" />
          ) : (
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
          )}
          <span>{currentMonthYear ?? "Pick month"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[260px] p-3">
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => handleYearChange(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">{currentYear}</span>
          <Button variant="ghost" size="icon" onClick={() => handleYearChange(1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <Button
              key={month}
              variant={selectedYear === currentYear && selectedMonth === index ? "default" : "outline"}
              onClick={() => handleMonthSelect(index)}
              className="h-6 text-xs dark:text-white"
            >
              {month}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
