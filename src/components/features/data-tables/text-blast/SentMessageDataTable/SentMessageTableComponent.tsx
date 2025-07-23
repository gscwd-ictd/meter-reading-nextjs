"use client";

import { FunctionComponent, Suspense } from "react";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { useSentMessageColumns } from "./SentMessageDataTableColumns";
import { SentMessageDataTable } from "./SentMessageDataTable";

export const SentMessageTableComponent: FunctionComponent = () => {
  const sentTextMessages = useTextBlastStore((state) => state.sentTextMessages);
  const sentTextMessageColumns = useSentMessageColumns();

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <SentMessageDataTable data={sentTextMessages ?? []} columns={sentTextMessageColumns} />
      </Suspense>
    </>
  );
};
