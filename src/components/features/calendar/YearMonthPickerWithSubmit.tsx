"use client";

import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@mr/components/ui/Button";
import { Popover, PopoverTrigger, PopoverContent } from "@mr/components/ui/Popover";
import { format, setMonth, setYear } from "date-fns";
import { useState } from "react";
import { formatYearMonthToReadableDate } from "@mr/lib/functions/formatDate";

interface YearMonthPickerWithSubmitProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function YearMonthPickerWithSubmit({ value, onChange, onSubmit }: YearMonthPickerWithSubmitProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Parse the current value if it exists
  const selectedDate = value ? new Date(`${value}-01`) : null;
  const selectedYear = selectedDate?.getFullYear();
  const selectedMonth = selectedDate?.getMonth();

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setYear(setMonth(new Date(), monthIndex), currentYear);
    onChange(format(newDate, "yyyy-MM"));
    setOpen(false);
  };

  const handleYearChange = (increment: number) => {
    setIsAnimating(true);

    // Start fade out
    setTimeout(() => {
      setCurrentYear((prev) => prev + increment);

      // Fade in after year change
      setTimeout(() => {
        setIsAnimating(false);
      }, 150);
    }, 150);
  };

  return (
    <div className="flex items-center justify-start gap-2 sm:justify-start md:justify-start lg:justify-end">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-[2.5rem] w-[200px] justify-start text-left font-normal sm:w-auto md:w-auto lg:w-[200px]"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? formatYearMonthToReadableDate(value) : "Select year month"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-3">
          <div className="mb-3 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => handleYearChange(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span
              className={`text-base font-medium transition-all duration-300 ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
            >
              {currentYear}
            </span>
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

      <Button
        onClick={onSubmit}
        disabled={!value}
        className="h-[2.5rem] w-full px-6 sm:w-auto md:w-auto lg:w-auto dark:text-white"
        size="sm"
      >
        Generate
      </Button>
    </div>
  );
}
