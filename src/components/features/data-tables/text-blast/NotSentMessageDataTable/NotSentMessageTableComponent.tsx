"use client";

import { FunctionComponent, Suspense } from "react";
import { useTextBlastStore } from "@/components/stores/useTextBlastStore";
import { NotSentMessageDataTable } from "./NotSentMessageDataTable";
import { useNotSentMessageColumns } from "./NotSentMessageDataTableColumns";

export const NotSentMessageTableComponent: FunctionComponent = () => {
  const notSentTextMessages = useTextBlastStore((state) => state.notSentTextMessages);
  const notSentTextMessageColumns = useNotSentMessageColumns(notSentTextMessages);

  return (
    <>
      <Suspense fallback={<p>Loading...</p>}>
        <NotSentMessageDataTable data={notSentTextMessages ?? []} columns={notSentTextMessageColumns} />
      </Suspense>
    </>
  );
};
