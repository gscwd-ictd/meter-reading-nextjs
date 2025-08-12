"use client";

import { Report } from "@mr/lib/enums/reports";
import { Label } from "@radix-ui/react-label";
import { FunctionComponent, useState } from "react";
import SimpleMonthYearPicker from "../calendar/SimpleMonthYearPicker";
import { Button } from "@mr/components/ui/Button";
import { useFormContext } from "react-hook-form";

export const SelectedReportOptions: FunctionComponent = () => {
  const { setValue, watch } = useFormContext();

  const selectedReport = watch("selectedReport");
  const [yearMonth, setYearMonth] = useState<string>("");

  // year-month validator
  const isValidDateString = (value: unknown): boolean => {
    if (typeof value !== "string") return false;

    // Match strict yyyy-MM-dd format
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!regex.test(value)) return false;

    // Check if the date is valid (e.g., no Feb 30)
    const date = new Date(value);
    return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  };

  return (
    <>
      <div className="flex flex-col space-y-2">
        {selectedReport === Report.METER_READING_SCHEDULE && (
          <>
            <Label
              htmlFor="report-name"
              className="text-left text-sm font-medium text-gray-700 dark:text-white"
            >
              Month-Year (YYYY-MM)
            </Label>
            <SimpleMonthYearPicker inputValue={yearMonth} setInputValue={setYearMonth} />
            {/* <div className="flex w-full pt-4">
              {selectedReport !== undefined && (
                <Button
                  asChild
                  className="h-[3rem] w-full px-4"
                  disabled={!isValidDateString(yearMonth) ? true : false}
                >
                  <a href={`reports/meter-reading-schedule?date=${yearMonth}`} target="_blank">
                    Generate
                  </a>
                </Button>
              )}
            </div> */}
          </>
        )}
      </div>
    </>
  );
};
