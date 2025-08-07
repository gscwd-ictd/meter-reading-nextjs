"use client";
import { useReportsContext } from "@mr/components/providers/ReportsProvider";
import { Report } from "@mr/lib/enums/reports";
import { Label } from "@radix-ui/react-label";
import { FunctionComponent, useState } from "react";
import SimpleMonthYearPicker from "../calendar/SimpleMonthYearPicker";
import { Button } from "@mr/components/ui/Button";
import { useRouter } from "next/navigation";

export const SelectedReportOptions: FunctionComponent = () => {
  const { selectedReport } = useReportsContext();
  const [yearMonth, setYearMonth] = useState<string>("");
  const router = useRouter();

  return (
    <>
      {selectedReport === Report.METER_READING_SCHEDULE && (
        <div className="flex flex-col items-start gap-0 p-4">
          <Label
            htmlFor="report-name"
            className="text-left text-sm font-medium text-gray-700 dark:text-white"
          >
            Month-Year (YYYY-MM)
          </Label>
          <SimpleMonthYearPicker inputValue={yearMonth} setInputValue={setYearMonth} />
        </div>
      )}

      {selectedReport !== undefined && (
        <Button
          className="mx-4 h-[3rem] dark:text-white"
          onClick={() => {
            if (yearMonth) router.push(`reports/meter-reading-schedule?date=${yearMonth}`);
          }}
        >
          Generate
        </Button>
      )}
    </>
  );
};
