"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { SampleTextMessageData } from "@mr/lib/mock/SampleTextMessageData";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { TextBlastReportDataTable } from "./TextBlastReportDataTable";
import { useTextBlastReportColumns } from "../TextBlastReportDataTableColumns";
import { Button } from "@mr/components/ui/Button";

export const TextBlastReportTableComponent: FunctionComponent = () => {
  const textMessages = useTextBlastStore((state) => state.textMessages);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  useEffect(() => {
    setTextMessages(SampleTextMessageData);
  }, []);

  const textBlastColumns = useTextBlastReportColumns(textMessages);

  return (
    <>
      <div className="p-4">
        <Suspense fallback={<p>Loading...</p>}>
          <TextBlastReportDataTable data={textMessages ?? []} columns={textBlastColumns} />
        </Suspense>
        <div className="flex justify-end">
          <Button variant={"default"} className="w-fit">
            Print
          </Button>
        </div>
      </div>
    </>
  );
};
