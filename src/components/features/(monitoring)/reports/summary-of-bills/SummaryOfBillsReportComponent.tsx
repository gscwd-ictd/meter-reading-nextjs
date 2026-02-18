"use client";

import { YearMonthPickerWithSubmit } from "@mr/components/features/calendar/YearMonthPickerWithSubmit";
import { useSearchParams } from "next/navigation";
import { FunctionComponent, PropsWithChildren, useState } from "react";
import { SummaryOfBillsPdf } from "./SummaryOfBillsPdf";

export const SummaryOfBillsReportComponent: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const [yearMonth, setYearMonth] = useState<string>(date ?? "");
  const [submittedYearMonth, setSubmittedYearMonth] = useState<string>(date ?? "");

  const handleGenerate = () => {
    setSubmittedYearMonth(yearMonth);
  };

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="grid flex-shrink-0 grid-cols-1 items-center sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
        <div>
          <h3 className="mt-5 text-xl font-bold">Summary of Bills Reports</h3>
        </div>

        {/* Header */}
        <YearMonthPickerWithSubmit value={yearMonth} onChange={setYearMonth} onSubmit={handleGenerate} />
      </div>
      <div className="mt-4 min-h-0 flex-1 overflow-auto">
        <SummaryOfBillsPdf yearMonth={submittedYearMonth} />
      </div>
    </div>
  );
};
