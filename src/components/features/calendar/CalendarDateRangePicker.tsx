"use client";
import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@mr/lib/utils";
import { Button } from "@mr/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@mr/components/ui/Popover";
import { Calendar } from "@mr/components/ui/Calendar";

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange) => void;
  initialDate?: DateRange;
}

export function CalendarDateRangePicker({
  className,
  onDateChange,
  initialDate,
}: CalendarDateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(initialDate);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint (768px)
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSelect = (selectedRange: DateRange | undefined) => {
    if (!selectedRange) {
      setDate(undefined);
      onDateChange?.({ from: undefined, to: undefined });
      return;
    }

    let newDate: DateRange;

    // Handle same day selection
    if (
      selectedRange.from &&
      selectedRange.to &&
      selectedRange.from.getTime() === selectedRange.to.getTime()
    ) {
      newDate = { from: selectedRange.from, to: selectedRange.from };
    }
    // Handle valid range selection
    else if (selectedRange.from && selectedRange.to) {
      if (selectedRange.to <= selectedRange.from) {
        newDate = { from: selectedRange.from, to: selectedRange.from };
      } else {
        newDate = selectedRange;
      }
    }
    // Handle single date selection
    else {
      newDate = { from: selectedRange.from, to: selectedRange.from };
    }

    setDate(newDate);
    onDateChange?.(newDate);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal md:w-[250px]",
              !date?.from && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to && !isSameDay(date.from, date.to) ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start" alignOffset={2} sideOffset={2}>
          <Calendar
            autoFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
