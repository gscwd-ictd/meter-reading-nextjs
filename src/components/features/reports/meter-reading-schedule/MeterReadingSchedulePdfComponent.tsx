"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ScheduleTable } from "./TestMeterReadingSchedulePdf";
import { YearMonthPickerWithSubmit } from "../../calendar/YearMonthPickerWithSubmit";

export const MeterReadingSchedulePdfComponent = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [yearMonth, setYearMonth] = useState<string>(date ?? "");
  const [submittedYearMonth, setSubmittedYearMonth] = useState<string>(date ?? "");

  useEffect(() => {
    if (date) {
      setYearMonth(date);
      setSubmittedYearMonth(date);
    }
  }, [date]);

  const handleGenerate = () => {
    setSubmittedYearMonth(yearMonth);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-1 items-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        <div>
          <h3 className="mt-5 text-xl font-bold">Report on Meter Reading Schedule</h3>
          <div className="mb-5 text-base font-medium text-gray-400"></div>
        </div>

        <YearMonthPickerWithSubmit value={yearMonth} onChange={setYearMonth} onSubmit={handleGenerate} />
      </div>
      <ScheduleTable yearMonth={submittedYearMonth} />
    </div>
  );
};
