"use client";

import { FunctionComponent, Suspense, useEffect } from "react";
import { SampleTextMessageData } from "@mr/lib/mock/SampleTextMessageData";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { useMessageColumns } from "../MessageDataTableColumns";
import { SentMessageDataTable } from "./SentMessageDataTable";

export const SentMessageTableComponent: FunctionComponent = () => {
  const textMessages = useTextBlastStore((state) => state.textMessages);
  const setTextMessages = useTextBlastStore((state) => state.setTextMessages);

  useEffect(() => {
    setTextMessages(SampleTextMessageData);
  }, []);

  const textMessageColumns = useMessageColumns(textMessages);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <SentMessageDataTable data={textMessages ?? []} columns={textMessageColumns} />
      </Suspense>
    </>
  );
};
