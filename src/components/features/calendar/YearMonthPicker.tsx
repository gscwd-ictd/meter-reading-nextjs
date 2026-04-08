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
  onClick?: () => void;
  disabled?: boolean;
}
export function YearMonthPicker({ value, onChange, onClick, disabled }: YearMonthPickerWithSubmitProps) {
  const [open, setOpen] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isAnimating, setIsAnimating] = useState(false);

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
            className="h-[2.5rem] w-[200px] justify-start text-left font-normal disabled:cursor-not-allowed sm:w-auto md:w-auto lg:w-[200px]"
            onClick={onClick}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span
              className={`${value ? "text-gray-800 dark:text-white" : "text-gray-500 dark:text-gray-500"}`}
            >
              {value ? formatYearMonthToReadableDate(value) : "Select year month"}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-3">
          <div className="mb-3 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange(-1)}
              disabled={isAnimating}
              className="transition-colors hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span
              className={`text-base font-medium transition-all duration-300 ${isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}
            >
              {currentYear}
            </span>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleYearChange(1)}
              disabled={isAnimating}
              className="transition-colors hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div
            className={`grid grid-cols-3 gap-2 transition-opacity duration-300 ${isAnimating ? "opacity-50" : "opacity-100"}`}
          >
            {months.map((month, index) => (
              <Button
                key={month}
                variant={selectedYear === currentYear && selectedMonth === index ? "default" : "outline"}
                onClick={() => handleMonthSelect(index)}
                className="h-6 text-xs transition-all dark:text-white"
                disabled={isAnimating}
              >
                {month}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
