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
  const [step, setStep] = useState<"year" | "month">("year");
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
          // Opening popover: retain year from current value if available
          if (currentMonthYear) {
            const parsed = parse(currentMonthYear, "yyyy-MM", new Date());
            setSelectedYear(parsed.getFullYear());
          }
          setStep("year"); // always start at year selection
        } else {
          setSelectedYear(null);
          setStep("year");
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
      <PopoverContent className="w-[220px] p-4">
        {step === "year" ? (
          <>
            <div className="text-muted-foreground mb-2 text-sm font-medium">Select a year</div>
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  onClick={() => {
                    setSelectedYear(year);
                    setStep("month");
                  }}
                  className="dark:text-white"
                >
                  {year}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Select a month</span>
              <Button variant="ghost" size="sm" onClick={() => setStep("year")}>
                Back
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <Button key={month} variant="outline" onClick={() => handleMonthClick(index)}>
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
