"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { SampleTextMessageData } from "@mr/lib/mock/SampleTextMessageData";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { useTextBlastColumns } from "../TextBlastDataTableColumns";
import { AreaTextBlastDataTable } from "./AreaTextBlastDataTable";
import { ZoneBookMonthDropdown } from "./ZoneBookMonthDropdown";

export const AreaTextBlastTableComponent: FunctionComponent = () => {
  const textMessages = useTextBlastStore((state) => state.textMessages);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  useEffect(() => {
    setTextMessages(SampleTextMessageData);
  }, []);

  const textBlastColumns = useTextBlastColumns(textMessages);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <ZoneBookMonthDropdown />
        <AreaTextBlastDataTable data={textMessages ?? []} columns={textBlastColumns} />
      </Suspense>
    </>
  );
};
