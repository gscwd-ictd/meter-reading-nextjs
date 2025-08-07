"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { format, addDays, isSaturday, isSunday, parse } from "date-fns";
import { DayPicker, DateAfter } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Popover, PopoverTrigger, PopoverContent } from "@mr/components/ui/Popover";
import { Input } from "@mr/components/ui/Input";
import { CalendarIcon } from "lucide-react";
import { normalizeToYyyyMmDd } from "@mr/lib/functions/normalizeToYyyyMmDd";

interface CalendarPickerProps {
  startDate: Date;
  dueDate: Date | undefined;
  disconnectionDate: Date | undefined;
  setDueDate: Dispatch<SetStateAction<Date | undefined>>;
  setDisconnectionDate: Dispatch<SetStateAction<Date | undefined>>;

  nonBusinessDays?: { id: string; date: string; name: string }[]; // e.g., "01-01", "12-25"
  holidays?: { id: string; name: string; date: string; type: string }[]; // e.g., "2025-08-07"
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  startDate,
  dueDate,
  disconnectionDate,
  setDueDate,
  setDisconnectionDate,
  nonBusinessDays = [],
  holidays = [],
}) => {
  const [open, setOpen] = useState(false);

  const computeSuggestedDueDate = (base: Date) => {
    let suggested = addDays(base, 15);
    if (isSaturday(suggested)) suggested = addDays(suggested, 2);
    else if (isSunday(suggested)) suggested = addDays(suggested, 1);
    return suggested;
  };

  const computeDisconnectionDate = (due: Date) => {
    let disconnection = addDays(due, 3);

    while (true) {
      const dateStr = format(disconnection, "yyyy-MM-dd");
      const monthDay = format(disconnection, "MM-dd");

      const isWeekend = isSaturday(disconnection) || isSunday(disconnection);
      const isNonBusiness = nonBusinessDays.some((d) => d.date === monthDay);
      const isHoliday = holidays.some((h) => normalizeToYyyyMmDd(h.date) === dateStr);

      if (!isWeekend && !isNonBusiness && !isHoliday) break;

      disconnection = addDays(disconnection, 1);
    }

    return disconnection;
  };

  useEffect(() => {
    const suggestedDue = computeSuggestedDueDate(startDate);
    setDueDate(suggestedDue);
    setDisconnectionDate(computeDisconnectionDate(suggestedDue));
  }, [startDate]);

  const handleDueDateSelect = (date: Date | undefined) => {
    setDueDate(date);
    setDisconnectionDate(date ? computeDisconnectionDate(date) : undefined);
    setOpen(false);
  };

  // ✅ Disable logic
  const isDateDisabled = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const monthDay = format(date, "MM-dd");

    // Disable weekends
    if (isSaturday(date) || isSunday(date)) return true;

    // Disable recurring non-business days
    const isNonBusinessDay = nonBusinessDays.some((day) => day.date === monthDay);

    // Disable specific holiday dates
    const isHoliday = holidays.some((h) => normalizeToYyyyMmDd(h.date) === dateStr);

    return isNonBusinessDay || isHoliday;
  };

  return (
    <div className="w-full space-y-4">
      {/* Due Date Picker */}
      <div className="flex flex-col gap-2">
        <label className="text-primary text-sm font-medium">Due Date</label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Input
                readOnly
                value={dueDate ? format(dueDate, "MMMM dd, yyyy") : ""}
                placeholder="Select due date"
              />
              <CalendarIcon className="absolute top-3 right-3 h-4 w-4 text-gray-500" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <DayPicker
              mode="single"
              selected={dueDate}
              onSelect={handleDueDateSelect}
              defaultMonth={dueDate || startDate || new Date()}
              disabled={isDateDisabled}
              className="w-full"
              components={{
                MonthCaption: ({ calendarMonth, displayIndex, ...props }) => (
                  <span {...props} className="flex w-full justify-center p-3 text-sm font-bold">
                    {format(calendarMonth.date, "MMMM yyyy")}
                  </span>
                ),
                DayButton: ({ day, modifiers, ...props }) => (
                  <button
                    {...props}
                    className={`text-sm ${modifiers.selected ? "text-primary font-black" : "font-normal text-gray-700"}`}
                  >
                    {day.date.getDate()}
                  </button>
                ),
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Disconnection Date */}
      <div className="flex flex-col gap-1">
        <label className="text-primary text-sm font-medium">Disconnection Date</label>
        <Input readOnly value={disconnectionDate ? format(disconnectionDate, "MMMM dd, yyyy") : ""} />
      </div>
    </div>
  );
};

export default CalendarPicker;
