"use client";

import { FunctionComponent, Suspense } from "react";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { TextBlastReportDataTable } from "./TextBlastReportDataTable";
import { useTextBlastReportColumns } from "./TextBlastReportDataTableColumns";
import { Button } from "@mr/components/ui/Button";

export const TextBlastReportTableComponent: FunctionComponent = () => {
  const textBlastReports = useTextBlastStore((state) => state.textBlastReports);
  const textBlastColumns = useTextBlastReportColumns();

  console.log("textBlastReports", textBlastReports);

  return (
    <>
      <div className="p-4">
        <Suspense fallback={<p>Loading...</p>}>
          <TextBlastReportDataTable data={textBlastReports ?? []} columns={textBlastColumns} />
        </Suspense>
        <div className="flex justify-end">
          <Button variant={"default"} className="w-fit">
            Generate Report
          </Button>
        </div>
      </div>
    </>
  );
};
