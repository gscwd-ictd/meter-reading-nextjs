"use client";
import dynamic from "next/dynamic";

const MeterReadingSchedulePdf = dynamic(
  () => import("@mr/components/features/reports/meter-reading-schedule/MeterReadingSchedulePdf"),
  { ssr: false },
);

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SimpleMonthYearPicker from "../../calendar/SimpleMonthYearPicker";

export const MeterReadingSchedulePdfComponent = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [yearMonth, setYearMonth] = useState<string>("");

  useEffect(() => {
    if (date) {
      setYearMonth(date);
    }
  }, [date]);

  return (
    <>
      <SimpleMonthYearPicker inputValue={yearMonth} setInputValue={setYearMonth} />;
      <MeterReadingSchedulePdf date={date!} />
    </>
  );
};
