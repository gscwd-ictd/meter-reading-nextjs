"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { SampleTextMessageData } from "@mr/lib/mock/SampleTextMessageData";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { useTextBlastColumns } from "../TextBlastDataTableColumns";
import { IndividualTextBlastDataTable } from "./IndividualTextBlastDataTable";

export const IndividualTextBlastTableComponent: FunctionComponent = () => {
  const textMessages = useTextBlastStore((state) => state.textMessages);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  useEffect(() => {
    setTextMessages(SampleTextMessageData);
  }, []);

  const textBlastColumns = useTextBlastColumns(textMessages);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <IndividualTextBlastDataTable data={textMessages ?? []} columns={textBlastColumns} />
      </Suspense>
    </>
  );
};
