"use client";
import dynamic from "next/dynamic";

const MeterReadingSchedulePdf = dynamic(
  () => import("@mr/components/features/reports/meter-reading-schedule/MeterReadingSchedulePdf"),
  { ssr: false },
);

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SimpleMonthYearPicker from "../../calendar/SimpleMonthYearPicker";
import { ScheduleTable } from "./TestMeterReadingSchedulePdf";

export const MeterReadingSchedulePdfComponent = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [yearMonth, setYearMonth] = useState<string>(date ?? "");

  useEffect(() => {
    if (date) {
      setYearMonth(date);
    }
  }, [date]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 items-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        <div>
          <h3 className="mt-5 text-xl font-bold">Report on Meter Reading Schedule</h3>
          <div className="font-m edium mb-5 text-base text-gray-400"> </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
          <SimpleMonthYearPicker inputValue={yearMonth} setInputValue={setYearMonth} />
        </div>
      </div>
      {/* <MeterReadingSchedulePdf date={date!} /> */}
      <ScheduleTable yearMonth={yearMonth} />
    </div>
  );
};
