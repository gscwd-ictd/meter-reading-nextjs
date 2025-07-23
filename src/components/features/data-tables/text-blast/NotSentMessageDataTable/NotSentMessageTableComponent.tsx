"use client";

import { FunctionComponent, Suspense } from "react";
import { useTextBlastStore } from "@mr/components/stores/useTextBlastStore";
import { NotSentMessageDataTable } from "./NotSentMessageDataTable";
import { useNotSentMessageColumns } from "./NotSentMessageDataTableColumns";

export const NotSentMessageTableComponent: FunctionComponent = () => {
  const notSentTextMessages = useTextBlastStore((state) => state.notSentTextMessages);
  const notSentTextMessageColumns = useNotSentMessageColumns();

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <NotSentMessageDataTable data={notSentTextMessages ?? []} columns={notSentTextMessageColumns} />
      </Suspense>
    </>
  );
};
