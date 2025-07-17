"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { SampleTextMessageData } from "@mr/lib/mock/SampleTextMessageData";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { NotSentMessageDataTable } from "./NotSentMessageDataTable";
import { useNotSentMessageColumns } from "../NotSentMessageDataTableColumns";

export const NotSentMessageTableComponent: FunctionComponent = () => {
  const textMessages = useTextBlastStore((state) => state.textMessages);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  useEffect(() => {
    setTextMessages(SampleTextMessageData);
  }, []);

  const textMessageColumns = useNotSentMessageColumns(textMessages);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <NotSentMessageDataTable data={textMessages ?? []} columns={textMessageColumns} />
      </Suspense>
    </>
  );
};
