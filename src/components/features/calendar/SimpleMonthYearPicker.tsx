"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { format, parse, setMonth, setYear, isValid } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@mr/components/ui/Button";
import { Input } from "@mr/components/ui/Input";
import { Popover, PopoverTrigger, PopoverContent } from "@mr/components/ui/Popover";

interface MonthYearPickerProps {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}

export default function MonthYearPicker({ inputValue, setInputValue }: MonthYearPickerProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"year" | "month">("year");
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  // const [inputValue, setInputValue] = useState("");

  const handleMonthClick = (monthIndex: number) => {
    if (selectedYear === null) return;

    const newDate = setYear(setMonth(new Date(), monthIndex), selectedYear);

    const formatted = format(newDate, "yyyy-MM");
    setInputValue(formatted);
    setOpen(false);
    setSelectedYear(null);
    setStep("year");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9-]/g, ""); // allow only digits and dash

    // Auto-insert dash after 4 digits if not already there
    if (value.length === 4 && !value.includes("-")) {
      value += "-";
    }

    // Prevent typing beyond yyyy-MM (7 chars)
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    setInputValue(value);
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
    <div className="flex w-full items-center gap-2">
      {/* Input with masking */}
      <Input value={inputValue} onChange={handleInputChange} placeholder="YYYY-MM" className="" />

      {/* Popover on calendar button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <CalendarIcon className="h-4 w-4 opacity-50" />
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
    </div>
  );
}
